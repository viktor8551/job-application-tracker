using api.Contracts;
using api.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace api.Controllers;

[ApiController]
[Route("api/attachment-policy")]
public class AttachmentPolicyController(IOptions<AttachmentOptions> options) : ControllerBase
{
    private readonly AttachmentOptions _options = options.Value;

    [HttpGet]
    public ActionResult<AttachmentPolicyResponse> Get()
    {
        return Ok(new AttachmentPolicyResponse(
            _options.MaxFiles,
            _options.MaxFileSizeBytes,
            _options.AllowedExtensions
        ));
    }
}
