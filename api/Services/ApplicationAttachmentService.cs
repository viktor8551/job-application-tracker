using api.Contracts;
using api.Data;
using api.Models;
using api.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace api.Services;

public class ApplicationAttachmentService(
    AppDbContext db,
    IFileStorageService fileStorageService,
    IOptions<AttachmentOptions> options
) : IApplicationAttachmentService
{
    private readonly AppDbContext _db = db;
    private readonly IFileStorageService _fileStorageService = fileStorageService;
    private readonly AttachmentOptions _options = options.Value;
    private readonly HashSet<string> _allowedExtensions = new(
        options.Value.AllowedExtensions,
        StringComparer.OrdinalIgnoreCase
    );

    public async Task<List<ApplicationAttachmentResponse>?> GetAttachmentsAsync(int applicationId, int userId)
    {
        var applicationExists = await _db.JobApplications
            .AnyAsync(application => application.Id == applicationId && application.UserId == userId);

        if (!applicationExists)
        {
            return null;
        }

        return await _db.ApplicationAttachments
            .Where(attachment => attachment.JobApplicationId == applicationId)
            .OrderByDescending(attachment => attachment.UploadedAt)
            .Select(attachment => ToResponse(attachment))
            .ToListAsync();
    }

    public async Task<ApplicationAttachmentResponse?> UploadAttachmentAsync(
        int applicationId,
        IFormFile file,
        int userId
    )
    {
        var applicationExists = await _db.JobApplications
            .AnyAsync(application => application.Id == applicationId && application.UserId == userId);

        if (!applicationExists)
        {
            return null;
        }

        if (file.Length == 0)
        {
            throw new InvalidOperationException("File is empty.");
        }

        if (file.Length > _options.MaxFileSizeBytes)
        {
            throw new InvalidOperationException("File is too large.");
        }

        var extension = Path.GetExtension(file.FileName);

        if (!_allowedExtensions.Contains(extension))
        {
            throw new InvalidOperationException("File type is not allowed.");
        }

        var currentFileCount = await _db.ApplicationAttachments
            .CountAsync(attachment => attachment.JobApplicationId == applicationId);

        if (currentFileCount >= _options.MaxFiles)
        {
            throw new InvalidOperationException("Maximum file count reached.");
        }

        var storedFileName = await _fileStorageService.SaveAsync(file);

        var attachment = new ApplicationAttachment
        {
            JobApplicationId = applicationId,
            OriginalFileName = Path.GetFileName(file.FileName),
            StoredFileName = storedFileName,
            ContentType = string.IsNullOrWhiteSpace(file.ContentType)
                ? "application/octet-stream"
                : file.ContentType,
            SizeBytes = file.Length
        };

        _db.ApplicationAttachments.Add(attachment);
        await _db.SaveChangesAsync();

        return ToResponse(attachment);
    }

    public async Task<ApplicationAttachmentDownload?> GetDownloadAsync(
        int applicationId,
        int attachmentId,
        int userId
    )
    {
        var attachment = await _db.ApplicationAttachments
            .Include(attachment => attachment.JobApplication)
            .FirstOrDefaultAsync(attachment =>
                attachment.Id == attachmentId &&
                attachment.JobApplicationId == applicationId &&
                attachment.JobApplication.UserId == userId
            );

        if (attachment is null)
        {
            return null;
        }

        var stream = await _fileStorageService.OpenReadAsync(attachment.StoredFileName);

        if (stream is null)
        {
            return null;
        }

        return new ApplicationAttachmentDownload(
            stream,
            attachment.OriginalFileName,
            attachment.ContentType
        );
    }

    public async Task<bool> DeleteAttachmentAsync(int applicationId, int attachmentId, int userId)
    {
        var attachment = await _db.ApplicationAttachments
            .Include(attachment => attachment.JobApplication)
            .FirstOrDefaultAsync(attachment =>
                attachment.Id == attachmentId &&
                attachment.JobApplicationId == applicationId &&
                attachment.JobApplication.UserId == userId
            );

        if (attachment is null)
        {
            return false;
        }

        _db.ApplicationAttachments.Remove(attachment);
        await _db.SaveChangesAsync();

        await _fileStorageService.DeleteAsync(attachment.StoredFileName);

        return true;
    }

    private static ApplicationAttachmentResponse ToResponse(ApplicationAttachment attachment)
    {
        return new ApplicationAttachmentResponse(
            attachment.Id,
            attachment.OriginalFileName,
            attachment.ContentType,
            attachment.SizeBytes,
            attachment.UploadedAt
        );
    }
}
