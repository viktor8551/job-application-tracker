using api.Contracts;

namespace api.Services;

public interface IJobApplicationService
{
    Task<List<JobApplicationResponse>> GetJobApplicationsAsync(int userId);
    Task<JobApplicationResponse?> GetJobApplicationByIdAsync(int id, int userId);
    Task<JobApplicationResponse> CreateJobApplicationAsync(CreateJobApplicationRequest request, int userId);
    Task<JobApplicationResponse?> UpdateJobApplicationAsync(int id, UpdateJobApplicationRequest request, int userId);
    Task<bool> DeleteJobApplicationAsync(int id, int userId);
}
