using Microsoft.AspNetCore.Http;

namespace api.Services;

public class LocalFileStorageService(IWebHostEnvironment environment) : IFileStorageService
{
    private readonly string _storagePath = Path.Combine(
            environment.ContentRootPath,
            "storage",
            "application-attachments"
        );

    public async Task<string> SaveAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        Directory.CreateDirectory(_storagePath);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var storedFileName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(_storagePath, storedFileName);

        await using var stream = File.Create(fullPath);
        await file.CopyToAsync(stream, cancellationToken);

        return storedFileName;
    }

    public Task<Stream?> OpenReadAsync(string storedFileName, CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_storagePath, storedFileName);

        if (!File.Exists(fullPath))
        {
            return Task.FromResult<Stream?>(null);
        }

        return Task.FromResult<Stream?>(File.OpenRead(fullPath));
    }

    public Task DeleteAsync(string storedFileName, CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_storagePath, storedFileName);

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }

        return Task.CompletedTask;
    }
}
