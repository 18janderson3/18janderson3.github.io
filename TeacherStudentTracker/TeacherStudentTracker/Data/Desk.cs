using TeacherStudentTracker.Views;

namespace TeacherStudentTracker.Data
{
    public class Desk
    {
        public int ID { get; set; }

        public string DeskNumber { get; set; } = string.Empty;

        public double XTransform { get; set; } = 0;

        public double YTransform { get; set; } = 0;

        public int? AssignedStudentID { get; set; } = null;

        public Desk(int? id = null, string deskNumber = "", double x = 0, double y = 0, int? assignedStudentID = null)
        {
            if (id is not null)
            {
                this.ID = id.Value;
            }
            else
            {
                this.ID = MainWindow.SelectedSchoolClass!.CurrentDeskID;
                MainWindow.SelectedSchoolClass!.CurrentDeskID++;
            }

            this.DeskNumber = deskNumber;
            this.XTransform = x;
            this.YTransform = y;
            this.AssignedStudentID = assignedStudentID;
        }
    }
}
