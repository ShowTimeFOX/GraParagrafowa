using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GraParagrafowa.Models;

namespace GraParagrafowa.Data
{
    public class GraParagrafowaContext : DbContext
    {
        public GraParagrafowaContext (DbContextOptions<GraParagrafowaContext> options)
            : base(options)
        {
        }

        public DbSet<GraParagrafowa.Models.DecisionBlock> DecisionBlock { get; set; } = default!;

        public DbSet<GraParagrafowa.Models.Story>? Story { get; set; }

        public DbSet<GraParagrafowa.Models.Choice>? Choice { get; set; }
    }
}
