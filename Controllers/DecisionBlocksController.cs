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

namespace GraParagrafowa.Controllers
{
    public class DecisionBlocksController : Controller
    {
        private readonly GraParagrafowaContext _context;

        public DecisionBlocksController(GraParagrafowaContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> HandleFormData([FromBody] StoryData data)
        {
            if (data == null || data.FormData == null)
            {
                return BadRequest("Invalid data.");
            }

            string storyName = data.StoryName;
            List<StoryItem> formData = data.FormData;
            string Photo;

            if (data.Photo != null)
            {
                Photo = Convert.ToBase64String(data.Photo);
            }
            else
            {
                Photo = "";
            } 




            Dictionary<int, Dictionary<int, string>> wybory = new Dictionary<int, Dictionary<int, string>>();
            List<DecisionBlock> blocks = new List<DecisionBlock>();

            foreach (var item in formData)
            {
                var decisionBlock = new DecisionBlock
                {
                    InStoryId = int.Parse(item.Id),
                    Description = item.Description,
                    ImagePath = item.Image != null ? Convert.ToBase64String(item.Image) : "",
                };

                if (!string.IsNullOrEmpty(item.Responses))
                {
                    Dictionary<int, string> dict = new Dictionary<int, string>();
                    var responses = item.Responses.Split(new[] { "&&$" }, StringSplitOptions.None);
                    foreach (var response in responses)
                    {
                        var parts = response.Split(new[] { "#*$" }, StringSplitOptions.None);
                        if (parts.Length == 2)
                        {
                            dict.Add(int.Parse(parts[0]), parts[1]);
                        }
                    }
                    wybory.Add(int.Parse(item.Id), dict);
                }

                blocks.Add(decisionBlock);
                Debug.WriteLine($"ilość wszystkich bloków: {blocks.Count}");
                Debug.WriteLine($"Jakiś jego id: {decisionBlock.InStoryId}");
            }

            foreach (var block in blocks)
            {
                if (block.Choices == null)
                {
                    block.Choices = new List<Choice>();
                }
                if (wybory.ContainsKey(block.InStoryId))
                {
                    Dictionary<int, string> choices = wybory[block.InStoryId];

                    foreach (var choice in choices)
                    {
                        var blokwyboru = blocks.First(c => c.InStoryId == choice.Key);
                        Debug.WriteLine($"Id bloku: {block.InStoryId}");
                        Debug.WriteLine($"Id dziecka: {choice.Key}");

                        Choice obiektchoice = new Choice
                        {
                            Text = choice.Value,
                            OutcomeBlock = blokwyboru
                        };
                        block.Choices.Add(obiektchoice);
                    }
                }
            }

            foreach (var block in blocks)
            {
                _context.DecisionBlock.Add(block);
            }



            // Handle the story name as needed
            Debug.WriteLine($"Story Name: {storyName}");

            Story story = new Story();
            story.Name = storyName;
            story.HistoryBlocks = blocks;
            story.ImagePath = Photo; //Tymczasowe żeby się to zapisało do bazy

            _context.Story.Add(story);

            await _context.SaveChangesAsync();

            return Json(new { success = true, message = "Dane odebrane i przetworzone pomyślnie." });
        }












        // GET: DecisionBlocks
        public async Task<IActionResult> Index()
        {
              return _context.DecisionBlock != null ? 
                          View(await _context.DecisionBlock.ToListAsync()) :
                          Problem("Entity set 'GraParagrafowaContext.DecisionBlock'  is null.");
        }

        // GET: DecisionBlocks/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.DecisionBlock == null)
            {
                return NotFound();
            }

            var decisionBlock = await _context.DecisionBlock
                .FirstOrDefaultAsync(m => m.Id == id);
            if (decisionBlock == null)
            {
                return NotFound();
            }

            return View(decisionBlock);
        }

        // GET: DecisionBlocks/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: DecisionBlocks/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,InStoryId,Description,ImagePath")] DecisionBlock decisionBlock)
        {
            if (ModelState.IsValid)
            {
                _context.Add(decisionBlock);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(decisionBlock);
        }

        // GET: DecisionBlocks/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.DecisionBlock == null)
            {
                return NotFound();
            }

            var decisionBlock = await _context.DecisionBlock.FindAsync(id);
            if (decisionBlock == null)
            {
                return NotFound();
            }
            return View(decisionBlock);
        }

        // POST: DecisionBlocks/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,InStoryId,Description,ImagePath")] DecisionBlock decisionBlock)
        {
            if (id != decisionBlock.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(decisionBlock);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DecisionBlockExists(decisionBlock.Id))
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
            return View(decisionBlock);
        }

        // GET: DecisionBlocks/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.DecisionBlock == null)
            {
                return NotFound();
            }

            var decisionBlock = await _context.DecisionBlock
                .FirstOrDefaultAsync(m => m.Id == id);
            if (decisionBlock == null)
            {
                return NotFound();
            }

            return View(decisionBlock);
        }

        // POST: DecisionBlocks/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.DecisionBlock == null)
            {
                return Problem("Entity set 'GraParagrafowaContext.DecisionBlock'  is null.");
            }
            var decisionBlock = await _context.DecisionBlock.FindAsync(id);
            if (decisionBlock != null)
            {
                _context.DecisionBlock.Remove(decisionBlock);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool DecisionBlockExists(int id)
        {
          return (_context.DecisionBlock?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
