using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PGMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "amenities",
                table: "rooms",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "rooms",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "floor_number",
                table: "rooms",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "images",
                table: "rooms",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<int>(
                name: "occupied_beds",
                table: "rooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "price",
                table: "rooms",
                type: "numeric(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "room_type",
                table: "rooms",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Standard");

            migrationBuilder.CreateIndex(
                name: "IX_rooms_floor_number",
                table: "rooms",
                column: "floor_number");

            migrationBuilder.CreateIndex(
                name: "IX_rooms_room_type",
                table: "rooms",
                column: "room_type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_rooms_floor_number",
                table: "rooms");

            migrationBuilder.DropIndex(
                name: "IX_rooms_room_type",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "amenities",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "description",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "floor_number",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "images",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "occupied_beds",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "price",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "room_type",
                table: "rooms");
        }
    }
}
