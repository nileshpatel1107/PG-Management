using FluentValidation;
using PGMS.Application.DTOs.PG;

namespace PGMS.Application.Validators;

public class CreatePGRequestValidator : AbstractValidator<CreatePGRequest>
{
    public CreatePGRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(255).WithMessage("Name must not exceed 255 characters");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters");
    }
}

