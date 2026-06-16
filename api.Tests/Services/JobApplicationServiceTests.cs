using api.Contracts;
using api.Data;
using api.Models;
using api.Services;
using Microsoft.EntityFrameworkCore;

namespace api.Tests.Services;

public sealed class JobApplicationServiceTests(PostgreSqlTestFixture fixture)
    : IClassFixture<PostgreSqlTestFixture>, IAsyncLifetime
{
    public async Task InitializeAsync()
    {
        await fixture.ResetDatabaseAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task CreateJobApplicationAsync_PersistsApplicationForUser()
    {
        await using var db = fixture.CreateDbContext();
        var user = await CreateUserAsync(db);
        var service = new JobApplicationService(db);
        var request = new CreateJobApplicationRequest(
            "This Company",
            "Backend Developer",
            ApplicationStatus.Interested,
            InterviewDate: new DateOnly(2026, 6, 20),
            JobUrl: "https://findjobs.com/job",
            Notes: "I Really want this job!");

        var result = await service.CreateJobApplicationAsync(request, user.Id);

        var saved = await db.JobApplications.SingleAsync();
        Assert.Equal(saved.Id, result.Id);
        Assert.Equal(user.Id, saved.UserId);
        Assert.Equal("This Company", result.CompanyName);
        Assert.Equal("Backend Developer", result.PositionTitle);
        Assert.Equal(ApplicationStatus.Interested, result.Status);
        Assert.Equal(new DateOnly(2026, 6, 20), result.InterviewDate);
        Assert.Equal("https://findjobs.com/job", result.JobUrl);
        Assert.Equal("I Really want this job!", result.Notes);
    }

    [Fact]
    public async Task GetJobApplicationsAsync_ReturnsOnlyRequestedUsersApplications()
    {
        await using var db = fixture.CreateDbContext();
        var firstUser = await CreateUserAsync(db);
        var secondUser = await CreateUserAsync(db);

        await CreateApplicationAsync(db, firstUser.Id, "Older Company", createdAt: DateTime.UtcNow.AddDays(-1));
        await CreateApplicationAsync(db, secondUser.Id, "Other User Company");
        await CreateApplicationAsync(db, firstUser.Id, "Newer Company", createdAt: DateTime.UtcNow);

        var service = new JobApplicationService(db);

        var results = await service.GetJobApplicationsAsync(firstUser.Id);

        Assert.Collection(
            results,
            application => Assert.Equal("Newer Company", application.CompanyName),
            application => Assert.Equal("Older Company", application.CompanyName));
    }

    [Fact]
    public async Task GetJobApplicationByIdAsync_ReturnsNullForAnotherUsersApplication()
    {
        await using var db = fixture.CreateDbContext();
        var owner = await CreateUserAsync(db);
        var otherUser = await CreateUserAsync(db);
        var application = await CreateApplicationAsync(db, owner.Id, "Private Company");
        var service = new JobApplicationService(db);

        var result = await service.GetJobApplicationByIdAsync(application.Id, otherUser.Id);

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateJobApplicationAsync_UpdatesFields()
    {
        await using var db = fixture.CreateDbContext();
        var user = await CreateUserAsync(db);
        var application = await CreateApplicationAsync(db, user.Id, "Before Company");
        var service = new JobApplicationService(db);
        var appliedDate = new DateOnly(2026, 6, 15);
        var interviewDate = new DateOnly(2026, 6, 22);
        var request = new UpdateJobApplicationRequest(
            "After Company",
            "Full Stack Developer",
            ApplicationStatus.Applied,
            appliedDate,
            interviewDate,
            JobUrl: "https://findjobs.com/updated",
            Notes: "Applied today");

        var result = await service.UpdateJobApplicationAsync(application.Id, request, user.Id);

        Assert.NotNull(result);
        Assert.Equal("After Company", result.CompanyName);
        Assert.Equal("Full Stack Developer", result.PositionTitle);
        Assert.Equal(ApplicationStatus.Applied, result.Status);
        Assert.Equal("https://findjobs.com/updated", result.JobUrl);
        Assert.Equal("Applied today", result.Notes);
        Assert.Equal(appliedDate, result.AppliedDate);
        Assert.Equal(interviewDate, result.InterviewDate);
    }

    [Fact]
    public async Task UpdateJobApplicationAsync_ReturnsNullForAnotherUsersApplication()
    {
        await using var db = fixture.CreateDbContext();
        var owner = await CreateUserAsync(db);
        var otherUser = await CreateUserAsync(db);
        var application = await CreateApplicationAsync(db, owner.Id, "Private Company");
        var service = new JobApplicationService(db);
        var request = new UpdateJobApplicationRequest(
            "Nope",
            "Nope",
            ApplicationStatus.Rejected);

        var result = await service.UpdateJobApplicationAsync(application.Id, request, otherUser.Id);

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteJobApplicationAsync_RemovesApplication()
    {
        await using var db = fixture.CreateDbContext();
        var user = await CreateUserAsync(db);
        var application = await CreateApplicationAsync(db, user.Id, "Company To Delete");
        var service = new JobApplicationService(db);

        var deleted = await service.DeleteJobApplicationAsync(application.Id, user.Id);

        Assert.True(deleted);
        Assert.False(await db.JobApplications.AnyAsync());
    }

    [Fact]
    public async Task DeleteJobApplicationAsync_ReturnsFalseForAnotherUsersApplication()
    {
        await using var db = fixture.CreateDbContext();
        var owner = await CreateUserAsync(db);
        var otherUser = await CreateUserAsync(db);
        var application = await CreateApplicationAsync(db, owner.Id, "Company to Keep");
        var service = new JobApplicationService(db);

        var deleted = await service.DeleteJobApplicationAsync(application.Id, otherUser.Id);

        Assert.False(deleted);
        Assert.True(await db.JobApplications.AnyAsync());
    }

    private static async Task<User> CreateUserAsync(AppDbContext db)
    {
        var user = new User();
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    private static async Task<JobApplication> CreateApplicationAsync(
        AppDbContext db,
        int userId,
        string companyName,
        DateTime? createdAt = null)
    {
        var application = new JobApplication
        {
            UserId = userId,
            CompanyName = companyName,
            PositionTitle = "Software Developer",
            Status = ApplicationStatus.Interested,
            CreatedAt = createdAt ?? DateTime.UtcNow
        };

        db.JobApplications.Add(application);
        await db.SaveChangesAsync();
        return application;
    }
}
