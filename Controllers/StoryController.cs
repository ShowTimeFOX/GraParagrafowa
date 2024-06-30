using GraParagrafowa.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace GraParagrafowa.Controllers
{
    public class StoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Player()
        {
            return View();
        }


        
    }
}
