using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PGMS.Domain.Entities;

namespace PGMS.Infrastructure.Data.Configurations;

public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.ToTable("tenants");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasColumnName("id");

        builder.Property(t => t.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.HasIndex(t => t.UserId).IsUnique();

        builder.Property(t => t.PGId)
            .HasColumnName("pg_id")
            .IsRequired();

        builder.HasIndex(t => t.PGId);

        builder.Property(t => t.BedId)
            .HasColumnName("bed_id");

        builder.HasIndex(t => t.BedId);

        builder.Property(t => t.JoinDate)
            .HasColumnName("join_date")
            .IsRequired();

        builder.Property(t => t.ExitDate)
            .HasColumnName("exit_date");

        builder.Property(t => t.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(t => t.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(t => t.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired();

        builder.HasOne(t => t.User)
            .WithOne(u => u.Tenant)
            .HasForeignKey<Tenant>(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.PG)
            .WithMany(p => p.Tenants)
            .HasForeignKey(t => t.PGId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Bed)
            .WithOne(b => b.Tenant)
            .HasForeignKey<Tenant>(t => t.BedId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

