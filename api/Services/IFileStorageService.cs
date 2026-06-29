using Microsoft.AspNetCore.Http;

namespace api.Services;

public interface IFileStorageService
{
    Task<string> SaveAsync(IFormFile file, CancellationToken cancellationToken = default);
    Task<Stream?> OpenReadAsync(string storedFileName, CancellationToken cancellationToken = default);
    Task DeleteAsync(string storedFileName, CancellationToken cancellationToken = default);
}
