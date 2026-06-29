using api.Data;
using api.Models;
using api.Options;
using api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions => npgsqlOptions.MapEnum<ApplicationStatus>("application_status")));

builder.Services.AddOptions<AttachmentOptions>()
    .BindConfiguration("Attachments")
    .Validate(options => options.MaxFiles > 0, "Attachments:MaxFiles must be greater than zero.")
    .Validate(options => options.MaxFileSizeMiB > 0, "Attachments:MaxFileSizeMiB must be greater than zero.")
    .Validate(
        options => options.AllowedExtensions.Length > 0 &&
            options.AllowedExtensions.All(extension => extension.StartsWith('.')),
        "Attachments:AllowedExtensions must contain extensions beginning with a dot."
    )
    .ValidateOnStart();

builder.Services.AddScoped<IJobApplicationService, JobApplicationService>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
builder.Services.AddScoped<IApplicationAttachmentService, ApplicationAttachmentService>();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter<ApplicationStatus>(allowIntegerValues: false)
        );
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.MapControllers();

app.Run();
