namespace PGMS.Domain.Entities;

public class RoleEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int RoleValue { get; set; } // Maps to Role enum value
    public bool IsActive { get; set; } = true;
}






