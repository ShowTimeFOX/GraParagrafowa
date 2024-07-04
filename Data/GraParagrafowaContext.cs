using Microsoft.EntityFrameworkCore;

namespace GraParagrafowa.Data
{
    public class GraParagrafowaContext : DbContext
    {
        public GraParagrafowaContext(DbContextOptions<GraParagrafowaContext> options)
            : base(options)
        {
        }

        public DbSet<GraParagrafowa.Models.DecisionBlock> DecisionBlock { get; set; } = default!;

        public DbSet<GraParagrafowa.Models.Story>? Story { get; set; }

        public DbSet<GraParagrafowa.Models.Choice>? Choice { get; set; }
    }
}
