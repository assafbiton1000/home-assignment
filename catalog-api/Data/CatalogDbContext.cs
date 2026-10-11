using CatalogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CatalogApi.Data;

public class CatalogDbContext(DbContextOptions<CatalogDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(category =>
        {
            category.Property(c => c.Name).HasMaxLength(100);
            category.HasIndex(c => c.Name).IsUnique();
            category.HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            category.HasData(
                new Category { Id = 1, Name = "חלב וגבינות" },
                new Category { Id = 2, Name = "בשר ודגים" },
                new Category { Id = 3, Name = "ירקות ופירות" },
                new Category { Id = 4, Name = "טואלטיקה" });
        });

        modelBuilder.Entity<Product>(product =>
        {
            product.Property(p => p.Name).HasMaxLength(100);

            product.HasData(
                new Product { Id = 1, CategoryId = 1, Name = "קוטג'" },
                new Product { Id = 2, CategoryId = 1, Name = "חלב 3%" },
                new Product { Id = 3, CategoryId = 1, Name = "שמנת חמוצה" },
                new Product { Id = 4, CategoryId = 1, Name = "גבינה צהובה" },
                new Product { Id = 5, CategoryId = 2, Name = "נקניקיות" },
                new Product { Id = 6, CategoryId = 2, Name = "שוקיים" },
                new Product { Id = 7, CategoryId = 2, Name = "סלמון" },
                new Product { Id = 8, CategoryId = 2, Name = "חזה עוף" },
                new Product { Id = 9, CategoryId = 3, Name = "עגבניות" },
                new Product { Id = 10, CategoryId = 3, Name = "מלפפונים" },
                new Product { Id = 11, CategoryId = 3, Name = "תפוחים" },
                new Product { Id = 12, CategoryId = 3, Name = "בננות" },
                new Product { Id = 13, CategoryId = 4, Name = "שמפו" },
                new Product { Id = 14, CategoryId = 4, Name = "סבון" },
                new Product { Id = 15, CategoryId = 4, Name = "משחת שיניים" });
        });
    }
}
