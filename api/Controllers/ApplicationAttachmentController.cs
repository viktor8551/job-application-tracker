using api.Contracts;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/applications/{applicationId:int}/attachments")]
public class ApplicationAttachmentController(
    IApplicationAttachmentService attachmentService
) : ControllerBase
{
    private readonly IApplicationAttachmentService _attachmentService = attachmentService;

    [HttpGet]
    public async Task<ActionResult<List<ApplicationAttachmentResponse>>> GetAll(int applicationId)
    {
        const int userId = 1;

        var attachments = await _attachmentService.GetAttachmentsAsync(applicationId, userId);

        if (attachments is null)
        {
            return NotFound();
        }

        return Ok(attachments);
    }

    [HttpPost]
    public async Task<ActionResult<ApplicationAttachmentResponse>> Upload(
        int applicationId,
        IFormFile file
    )
    {
        const int userId = 1;

        try
        {
            var attachment = await _attachmentService.UploadAttachmentAsync(applicationId, file, userId);

            if (attachment is null)
            {
                return NotFound();
            }

            return CreatedAtAction(
                nameof(GetAll),
                new { applicationId },
                attachment
            );
        }
        catch (InvalidOperationException error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpGet("{attachmentId:int}/download")]
    public async Task<IActionResult> Download(int applicationId, int attachmentId)
    {
        const int userId = 1;

        var download = await _attachmentService.GetDownloadAsync(
            applicationId,
            attachmentId,
            userId
        );

        if (download is null)
        {
            return NotFound();
        }

        return File(
            download.Content,
            download.ContentType,
            download.OriginalFileName
        );
    }

    [HttpDelete("{attachmentId:int}")]
    public async Task<IActionResult> Delete(int applicationId, int attachmentId)
    {
        const int userId = 1;

        var deleted = await _attachmentService.DeleteAttachmentAsync(
            applicationId,
            attachmentId,
            userId
        );

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
