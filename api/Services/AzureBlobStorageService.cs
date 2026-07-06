using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace api.Services;

public sealed class AzureBlobStorageService(BlobContainerClient containerClient) : IFileStorageService
{
    private readonly BlobContainerClient _containerClient = containerClient;

    public async Task<string> SaveAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var storedFileName = $"{Guid.NewGuid():N}{extension}";
        var blobClient = _containerClient.GetBlobClient(storedFileName);

        await using var stream = file.OpenReadStream();
        await blobClient.UploadAsync(
            stream,
            new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = string.IsNullOrWhiteSpace(file.ContentType)
                        ? "application/octet-stream"
                        : file.ContentType
                },
                Conditions = new BlobRequestConditions
                {
                    IfNoneMatch = ETag.All
                }
            },
            cancellationToken
        );

        return storedFileName;
    }

    public async Task<Stream?> OpenReadAsync(string storedFileName, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _containerClient
                .GetBlobClient(storedFileName)
                .OpenReadAsync(cancellationToken: cancellationToken);
        }
        catch (RequestFailedException error) when (error.Status == StatusCodes.Status404NotFound)
        {
            return null;
        }
    }

    public async Task DeleteAsync(string storedFileName, CancellationToken cancellationToken = default)
    {
        await _containerClient
            .GetBlobClient(storedFileName)
            .DeleteIfExistsAsync(
                DeleteSnapshotsOption.IncludeSnapshots,
                cancellationToken: cancellationToken
            );
    }
}
