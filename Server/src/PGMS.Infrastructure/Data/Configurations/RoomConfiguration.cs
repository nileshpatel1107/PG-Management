using Microsoft.EntityFrameworkCore;
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

