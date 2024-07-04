using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GraParagrafowa.Migrations
{
    public partial class essa : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SourceBlockId",
                table: "Choice",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Choice_SourceBlockId",
                table: "Choice",
                column: "SourceBlockId");

            migrationBuilder.AddForeignKey(
                name: "FK_Choice_DecisionBlock_SourceBlockId",
                table: "Choice",
                column: "SourceBlockId",
                principalTable: "DecisionBlock",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choice_DecisionBlock_SourceBlockId",
                table: "Choice");

            migrationBuilder.DropIndex(
                name: "IX_Choice_SourceBlockId",
                table: "Choice");

            migrationBuilder.DropColumn(
                name: "SourceBlockId",
                table: "Choice");
        }
    }
}
