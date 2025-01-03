using TeacherStudentTracker.Views;

namespace TeacherStudentTracker.Data
{
    public class MiscObject
    {
        public int ID { get; set; }

        public string ObjectName { get; set; } = string.Empty;

        public double XTransform { get; set; } = 0;

        public double YTransform { get; set; } = 0;

        public double Width { get; set; } = 200;

        public double Height { get; set; } = 140;

        public MiscObject(int? id = null, string objectName = "", double x = 0, double y = 0, double width = 200, double height = 140)
        {
            if (id is not null)
            {
                this.ID = id.Value;
            }
            else
            {
                this.ID = MainWindow.SelectedSchoolClass!.CurrentMiscObjectID;
                MainWindow.SelectedSchoolClass!.CurrentMiscObjectID++;
            }

            this.ObjectName = objectName;
            this.XTransform = x;
            this.YTransform = y;

            this.Width = width;
            this.Height = height;
        }
    }
}
