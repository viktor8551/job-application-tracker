using api.Contracts;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

public class JobApplicationService(
    AppDbContext db
) : IJobApplicationService
{
    private readonly AppDbContext _db = db;

    public async Task<JobApplicationResponse?> UpdateJobApplicationAsync(int id, UpdateJobApplicationRequest request, int userId)
    {
        var application = await _db.JobApplications
            .FirstOrDefaultAsync(application => application.Id == id && application.UserId == userId);

        if (application is null)
        {
            return null;
        }

        application.CompanyName = request.CompanyName;
        application.PositionTitle = request.PositionTitle;
        application.Status = request.Status;
        application.AppliedDate = request.AppliedDate;
        application.JobUrl = request.JobUrl;
        application.Notes = request.Notes;

        await _db.SaveChangesAsync();

        return ToResponse(application);
    }

    public async Task<bool> DeleteJobApplicationAsync(int id, int userId)
    {
        var application = await _db.JobApplications
            .FirstOrDefaultAsync(application => application.Id == id && application.UserId == userId);

        if (application is null)
        {
            return false;
        }

        _db.JobApplications.Remove(application);
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<JobApplicationResponse> CreateJobApplicationAsync(CreateJobApplicationRequest request, int userId)
    {
        var application = new JobApplication
        {
            UserId = userId,
            CompanyName = request.CompanyName,
            PositionTitle = request.PositionTitle,
            Status = request.Status,
            AppliedDate = request.AppliedDate,
            JobUrl = request.JobUrl,
            Notes = request.Notes
        };

        _db.JobApplications.Add(application);
        await _db.SaveChangesAsync();

        return ToResponse(application);
    }

    public async Task<JobApplicationResponse?> GetJobApplicationByIdAsync(int id, int userId)
    {
        return await _db.JobApplications
            .Where(application => application.Id == id && application.UserId == userId)
            .Select(application => ToResponse(application))
            .FirstOrDefaultAsync();
    }

    public async Task<List<JobApplicationResponse>> GetJobApplicationsAsync(int userId)
    {
        return await _db.JobApplications
            .Where(application => application.UserId == userId)
            .OrderByDescending(application => application.CreatedAt)
            .Select(application => ToResponse(application))
            .ToListAsync();
    }

    private static JobApplicationResponse ToResponse(JobApplication application)
    {
        return new JobApplicationResponse(
            application.Id,
            application.CompanyName,
            application.PositionTitle,
            application.Status,
            application.AppliedDate,
            application.JobUrl,
            application.Notes,
            application.CreatedAt
        );
    }
}
