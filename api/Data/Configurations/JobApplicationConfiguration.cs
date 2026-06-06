using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Data.Configurations;

public class JobApplicationConfiguration : IEntityTypeConfiguration<JobApplication>
{
    public void Configure(EntityTypeBuilder<JobApplication> builder)
    {
        builder.Property(application => application.CompanyName)
            .HasMaxLength(150);

        builder.Property(application => application.PositionTitle)
            .HasMaxLength(150);

        builder.Property(application => application.JobUrl)
            .HasMaxLength(2048);

        builder.Property(application => application.Notes)
            .HasMaxLength(3000);

        builder.Property(application => application.CreatedAt)
            .HasDefaultValueSql("NOW()");
    }
}
