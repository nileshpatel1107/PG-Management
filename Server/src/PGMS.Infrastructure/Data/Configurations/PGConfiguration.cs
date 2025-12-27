using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PGMS.Domain.Entities;

namespace PGMS.Infrastructure.Data.Configurations;

public class PGConfiguration : IEntityTypeConfiguration<PG>
{
    public void Configure(EntityTypeBuilder<PG> builder)
    {
        builder.ToTable("pgs");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");

        builder.Property(p => p.Name)
            .HasColumnName("name")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(p => p.Address)
            .HasColumnName("address")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(p => p.OwnerId)
            .HasColumnName("owner_id")
            .IsRequired();

        builder.HasIndex(p => p.OwnerId);

        builder.Property(p => p.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(p => p.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired();

        builder.HasOne(p => p.Owner)
            .WithMany()
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Rooms)
            .WithOne(r => r.PG)
            .HasForeignKey(r => r.PGId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Tenants)
            .WithOne(t => t.PG)
            .HasForeignKey(t => t.PGId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

