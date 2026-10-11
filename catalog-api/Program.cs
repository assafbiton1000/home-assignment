using CatalogApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CatalogDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("Catalog"),
        sql => sql.EnableRetryOnFailure()));

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(builder.Configuration["ClientOrigin"]!).WithMethods("GET")));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();
    await db.Database.MigrateAsync();
}

app.UseCors();

app.MapGet("/api/categories", async (CatalogDbContext db) =>
    await db.Categories
        .OrderBy(c => c.Id)
        .Select(c => new CategoryDto(
            c.Id,
            c.Name,
            c.Products
                .OrderBy(p => p.Name)
                .Select(p => new ProductDto(p.Id, p.Name))
                .ToList()))
        .ToListAsync());

app.Run();

record CategoryDto(int Id, string Name, List<ProductDto> Products);

record ProductDto(int Id, string Name);
