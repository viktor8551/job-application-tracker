using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api.Data.Configurations;

public class ApplicationAttachmentConfiguration : IEntityTypeConfiguration<ApplicationAttachment>
{
    public void Configure(EntityTypeBuilder<ApplicationAttachment> builder)
    {
        builder.Property(attachment => attachment.OriginalFileName)
            .HasMaxLength(255);

        builder.Property(attachment => attachment.StoredFileName)
            .HasMaxLength(255);

        builder.Property(attachment => attachment.ContentType)
            .HasMaxLength(100);

        builder.Property(attachment => attachment.UploadedAt)
            .HasDefaultValueSql("NOW()");

        builder.HasOne(attachment => attachment.JobApplication)
            .WithMany(application => application.Attachments)
            .HasForeignKey(attachment => attachment.JobApplicationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
