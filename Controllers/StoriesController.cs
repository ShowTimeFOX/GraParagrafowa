using GraParagrafowa.Data;
using GraParagrafowa.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace GraParagrafowa.Controllers
{
    public class StoriesController : Controller
    {
        private readonly GraParagrafowaContext _context;

        public StoriesController(GraParagrafowaContext context)
        {
            _context = context;
        }





        //[HttpGet]
        //public async Task<IActionResult> Player(int id)
        //{
        //    var story = await _context.Story
        //                              .Include(s => s.HistoryBlocks)
        //                              .ThenInclude(b => b.Choices)
        //                              .FirstOrDefaultAsync(s => s.Id == id);

        //    if (story == null)
        //    {
        //        return NotFound();
        //    }

        //    Debug.WriteLine("ok");

        //    return View(story);
        //}

        //[HttpGet]
        //public async Task<IActionResult> UpdatePage()
        //{

        //    List<Story> allstories = new List<Story>();

        //    foreach(var story in _context.Story)
        //    {
        //        allstories.Add(story);
        //    }
        //    var stories = await _context.Story
        //                              .Include(s => s.Name)
        //                              .ThenInclude(b => b.Choices)
        //                              .FirstOrDefaultAsync(s => s.Id == id);

        //    if (story == null)
        //    {
        //        return NotFound();
        //    }

        //    Debug.WriteLine("ok");

        //    return View(story);
        //}






        // GET: Stories
        public async Task<IActionResult> Index()
        {
            return _context.Story != null ?
                        View(await _context.Story.ToListAsync()) :
                        Problem("Entity set 'GraParagrafowaContext.Story'  is null.");
        }

        // GET: Stories/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Story == null)
            {
                return NotFound();
            }

            var story = await _context.Story
                .FirstOrDefaultAsync(m => m.Id == id);
            if (story == null)
            {
                return NotFound();
            }

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
            if (id == null || _context.Story == null)
            {
                return NotFound();
            }

            var story = await _context.Story.FindAsync(id);
            if (story == null)
            {
                return NotFound();
            }
            return View(story);
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
            if (id == null || _context.Story == null)
            {
                return NotFound();
            }

            var story = await _context.Story
                .FirstOrDefaultAsync(m => m.Id == id);
            if (story == null)
            {
                return NotFound();
            }

            return View(story);
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
