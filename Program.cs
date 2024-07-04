using GraParagrafowa.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
namespace GraParagrafowa
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<GraParagrafowaContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("GraParagrafowaContext") ?? throw new InvalidOperationException("Connection string 'GraParagrafowaContext' not found.")));

            // Dodanie kontrolerów z widokami oraz konfiguracja JSON
            builder.Services.AddControllersWithViews()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
                });

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }

    }
}