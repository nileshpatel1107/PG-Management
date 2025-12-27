using FluentValidation;
using PGMS.Application.DTOs.Room;

namespace PGMS.Application.Validators;

public class CreateRoomRequestValidator : AbstractValidator<CreateRoomRequest>
{
    public CreateRoomRequestValidator()
    {
        RuleFor(x => x.PGId)
            .NotEmpty().WithMessage("PG ID is required");

        RuleFor(x => x.RoomNumber)
            .NotEmpty().WithMessage("Room number is required")
            .MaximumLength(50).WithMessage("Room number must not exceed 50 characters");

        RuleFor(x => x.Capacity)
            .GreaterThan(0).WithMessage("Capacity must be greater than 0");
    }
}

