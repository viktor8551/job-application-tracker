using api.Contracts;
using Microsoft.AspNetCore.Http;

namespace api.Services;

public interface IApplicationAttachmentService
{
    Task<List<ApplicationAttachmentResponse>?> GetAttachmentsAsync(int applicationId, int userId);
    Task<ApplicationAttachmentResponse?> UploadAttachmentAsync(int applicationId, IFormFile file, int userId);
    Task<ApplicationAttachmentDownload?> GetDownloadAsync(int applicationId, int attachmentId, int userId);
    Task<bool> DeleteAttachmentAsync(int applicationId, int attachmentId, int userId);
}
