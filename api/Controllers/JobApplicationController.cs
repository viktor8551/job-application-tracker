using api.Contracts;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/applications")]
public class JobApplicationController(
    IJobApplicationService jobApplicationService
) : ControllerBase
{
    private readonly IJobApplicationService _jobApplicationService = jobApplicationService;

    [HttpGet]
    public async Task<ActionResult<List<JobApplicationResponse>>> GetAll()
    {
        // TODO: Replace with authenticated user
        const int userId = 1;
        var applications = await _jobApplicationService.GetJobApplicationsAsync(userId);
        return Ok(applications);
    }

    [HttpPost]
    public async Task<ActionResult<JobApplicationResponse>> Create(CreateJobApplicationRequest request)
    {
        // TODO: Replace with authenticated user
        const int userId = 1;
        var application = await _jobApplicationService.CreateJobApplicationAsync(request, userId);

        return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<JobApplicationResponse>> GetById(int id)
    {
        // TODO: Replace with authenticated user
        const int userId = 1;
        var application = await _jobApplicationService.GetJobApplicationByIdAsync(id, userId);

        if (application is null)
        {
             return NotFound();
        }

        return Ok(application);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        // TODO: Replace with authenticated user
        const int userId = 1;
        var deleted = await _jobApplicationService.DeleteJobApplicationAsync(id, userId);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<JobApplicationResponse>> Update(int id, UpdateJobApplicationRequest request)
    {
        // TODO: Replace with authenticated user
        const int userId = 1;
        var application = await _jobApplicationService.UpdateJobApplicationAsync(id, request, userId);

        if (application is null)
        {
            return NotFound();
        }
        
        return Ok(application);
    }
}
