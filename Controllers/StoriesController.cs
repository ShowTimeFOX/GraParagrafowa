using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GraParagrafowa.Data;
using GraParagrafowa.Models;
using System.Diagnostics;
using PagedList;

namespace GraParagrafowa.Controllers
{
    public class StoriesController : Controller
    {
        private readonly GraParagrafowaContext _context;

        public StoriesController(GraParagrafowaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Player(int id)
        {
            var aaaaaa = await _context.Story
                                       .Include(s => s.HistoryBlocks) // Eagerly load HistoryBlocks
                                       .FirstOrDefaultAsync(s => s.Id == id);

            var choiceschuj = await _context.Choice
                                .Where(c => c.storryID == id)
                                .ToListAsync();

            var dto = new GameDTO
            {
                story = aaaaaa,
                choice_list = choiceschuj
            };

            if (aaaaaa == null)
            {
                return NotFound();
            }



            var l = new List<DecisionBlock>();
            foreach (var item in aaaaaa.HistoryBlocks)
            {
                l.Add(item);
                Debug.WriteLine($"{item.Id}");
                Debug.WriteLine("KURWOOOOOOOOOOOOOOOOOOOOOO");
            }

            Debug.WriteLine("ok");

            return View(dto);
        }


        [HttpGet]
        public ViewResult Index(string sortOrder, string searchString, int? page, int pageSize = 5)
        {
            ViewBag.CurrentSort = sortOrder;
            ViewBag.NameSortParm = String.IsNullOrEmpty(sortOrder) ? "name_desc" : "";
            ViewBag.CurrentFilter = searchString;

            var stories = from s in _context.Story select s;

            if (!String.IsNullOrEmpty(searchString))
            {
                stories = stories.Where(s => s.Name.Contains(searchString));
            }

            switch (sortOrder)
            {
                case "name_desc":
                    stories = stories.OrderByDescending(s => s.Name);
                    break;
                default:
                    stories = stories.OrderBy(s => s.Name);
                    break;
            }

            int pageNumber = (page ?? 1);
            int totalItems = stories.Count();
            var items = stories.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

            ViewBag.TotalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            ViewBag.CurrentPage = pageNumber;

            return View(items);
        }



        // GET: Stories/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            var story = await _context.Story
                                       .Include(s => s.HistoryBlocks) // Eagerly load HistoryBlocks
                                       .FirstOrDefaultAsync(s => s.Id == id);

            return View(story);
        }

        // GET: Stories/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Stories/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,ImagePath")] Story story)
        {
            if (ModelState.IsValid)
            {
                _context.Add(story);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(story);
        }

        // GET: Stories/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            var aaaaaa = await _context.Story
                                       .Include(s => s.HistoryBlocks) // Eagerly load HistoryBlocks
                                       .FirstOrDefaultAsync(s => s.Id == id);

            var choiceschuj = await _context.Choice
                                .Where(c => c.storryID == id)
                                .ToListAsync();

            var dto = new GameDTO
            {
                story = aaaaaa,
                choice_list = choiceschuj
            };

            var story = await _context.Story.FindAsync(id);
            if (story == null)
            {
                return NotFound();
            }
            return View(dto);
        }

        // POST: Stories/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,ImagePath")] Story story)
        {
            if (id != story.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(story);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StoryExists(story.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(story);
        }

        // GET: Stories/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {

            var story = await _context.Story
                                       .Include(s => s.HistoryBlocks) // Eagerly load HistoryBlocks
                                       .FirstOrDefaultAsync(s => s.Id == id);

            var ListaWyborowHistorii = await _context.Choice
                                .Where(c => c.storryID == id)
                                .ToListAsync();



            if (ListaWyborowHistorii.Any())
            {
                _context.Choice.RemoveRange(ListaWyborowHistorii); // Usuwasz obiekty z kontekstu
                _context.SaveChanges(); // Zapisujesz zmiany w bazie danych
            }



            var blocksToRemove = story.HistoryBlocks.ToList(); // Pobierasz listę do usunięcia (przykład)

            if (blocksToRemove.Any())
            {
                _context.DecisionBlock.RemoveRange(blocksToRemove); // Usuwasz obiekty z kontekstu
                _context.SaveChanges(); // Zapisujesz zmiany w bazie danych
            }

            
            _context.Story.Remove(story);
            

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // POST: Stories/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Story == null)
            {
                return Problem("Entity set 'GraParagrafowaContext.Story'  is null.");
            }
            var story = await _context.Story.FindAsync(id);
            if (story != null)
            {
                _context.Story.Remove(story);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool StoryExists(int id)
        {
          return (_context.Story?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
