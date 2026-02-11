using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PGMS.Domain.Entities;

namespace PGMS.Infrastructure.Data.Configurations;

public class RoomConfiguration : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> builder)
    {
        builder.ToTable("rooms");

        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasColumnName("id");

        builder.Property(r => r.PGId)
            .HasColumnName("pg_id")
            .IsRequired();

        builder.HasIndex(r => r.PGId);

        builder.Property(r => r.RoomNumber)
            .HasColumnName("room_number")
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(r => r.Capacity)
            .HasColumnName("capacity")
            .IsRequired();

        builder.Property(r => r.IsAvailable)
            .HasColumnName("is_available")
            .IsRequired();

        builder.Property(r => r.Description)
            .HasColumnName("description");

        builder.Property(r => r.FloorNumber)
            .HasColumnName("floor_number");

        builder.Property(r => r.RoomType)
            .HasColumnName("room_type")
            .HasMaxLength(50)
            .HasDefaultValue("Standard");

        builder.Property(r => r.Price)
            .HasColumnName("price")
            .HasColumnType("decimal(10,2)");

        builder.Property(r => r.Amenities)
            .HasColumnName("amenities")
            .HasColumnType("text[]")
            .HasConversion(
                v => v == null || v.Count == 0 ? Array.Empty<string>() : v.ToArray(),
                v => v == null || v.Length == 0 ? new List<string>() : v.ToList(),
                new ValueComparer<List<string>>(
                    (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));

        builder.Property(r => r.Images)
            .HasColumnName("images")
            .HasColumnType("text[]")
            .HasConversion(
                v => v == null || v.Count == 0 ? Array.Empty<string>() : v.ToArray(),
                v => v == null || v.Length == 0 ? new List<string>() : v.ToList(),
                new ValueComparer<List<string>>(
                    (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));

        builder.Property(r => r.OccupiedBeds)
            .HasColumnName("occupied_beds")
            .HasDefaultValue(0);

        builder.HasIndex(r => r.RoomType);
        builder.HasIndex(r => r.FloorNumber);

        builder.Property(r => r.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(r => r.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(r => r.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired();

        builder.HasOne(r => r.PG)
            .WithMany(p => p.Rooms)
            .HasForeignKey(r => r.PGId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(r => r.Beds)
            .WithOne(b => b.Room)
            .HasForeignKey(b => b.RoomId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

