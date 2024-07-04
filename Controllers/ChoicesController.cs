using GraParagrafowa.Data;
using GraParagrafowa.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GraParagrafowa.Controllers
{
    public class ChoicesController : Controller
    {
        private readonly GraParagrafowaContext _context;

        public ChoicesController(GraParagrafowaContext context)
        {
            _context = context;
        }

        // GET: Choices
        public async Task<IActionResult> Index()
        {
            return _context.Choice != null ?
                        View(await _context.Choice.ToListAsync()) :
                        Problem("Entity set 'GraParagrafowaContext.Choice'  is null.");
        }

        // GET: Choices/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Choice == null)
            {
                return NotFound();
            }

            var choice = await _context.Choice
                .FirstOrDefaultAsync(m => m.Id == id);
            if (choice == null)
            {
                return NotFound();
            }

            return View(choice);
        }

        // GET: Choices/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Choices/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Text")] Choice choice)
        {
            if (ModelState.IsValid)
            {
                _context.Add(choice);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(choice);
        }

        // GET: Choices/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Choice == null)
            {
                return NotFound();
            }

            var choice = await _context.Choice.FindAsync(id);
            if (choice == null)
            {
                return NotFound();
            }
            return View(choice);
        }

        // POST: Choices/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Text")] Choice choice)
        {
            if (id != choice.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(choice);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ChoiceExists(choice.Id))
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
            return View(choice);
        }

        // GET: Choices/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Choice == null)
            {
                return NotFound();
            }

            var choice = await _context.Choice
                .FirstOrDefaultAsync(m => m.Id == id);
            if (choice == null)
            {
                return NotFound();
            }

            return View(choice);
        }

        // POST: Choices/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Choice == null)
            {
                return Problem("Entity set 'GraParagrafowaContext.Choice'  is null.");
            }
            var choice = await _context.Choice.FindAsync(id);
            if (choice != null)
            {
                _context.Choice.Remove(choice);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ChoiceExists(int id)
        {
            return (_context.Choice?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
