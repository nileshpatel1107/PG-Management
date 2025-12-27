using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PGMS.Domain.Entities;

namespace PGMS.Infrastructure.Data.Configurations;

public class BedConfiguration : IEntityTypeConfiguration<Bed>
{
    public void Configure(EntityTypeBuilder<Bed> builder)
    {
        builder.ToTable("beds");

        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id).HasColumnName("id");

        builder.Property(b => b.RoomId)
            .HasColumnName("room_id")
            .IsRequired();

        builder.HasIndex(b => b.RoomId);

        builder.Property(b => b.BedNumber)
            .HasColumnName("bed_number")
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(b => b.IsOccupied)
            .HasColumnName("is_occupied")
            .IsRequired();

        builder.Property(b => b.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(b => b.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(b => b.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired();

        builder.HasOne(b => b.Room)
            .WithMany(r => r.Beds)
            .HasForeignKey(b => b.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(b => b.Tenant)
            .WithOne(t => t.Bed)
            .HasForeignKey<Tenant>(t => t.BedId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

