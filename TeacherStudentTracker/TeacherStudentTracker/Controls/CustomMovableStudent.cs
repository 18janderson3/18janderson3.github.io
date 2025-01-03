using Avalonia;
using Avalonia.Controls;
using Avalonia.Input;
using Avalonia.Media;
using System.Collections.Generic;
using System.Linq;
using TeacherStudentTracker;
using TeacherStudentTracker.Data;
using TeacherStudentTracker.Views;

namespace Controls
{
    public class CustomMovableStudent : Border
    {
        private bool _isPressed;

        public Point PositionInBlock { get; set; }

        public TranslateTransform Transform { get; set; } = new TranslateTransform(0, 0);

        public CustomMovableDesk? AssignedDesk { get; set; } = null;

        public Student _Student { get; set; }

        public CustomMovableStudent()
        {
            // DO NOT USE THIS CONSTRUCTOR. This is only for development purposes and this object will not work if you use this one.

            this._Student = null!;
        }

        public CustomMovableStudent(Student student)
        {
            this._Student = student;

            this.Transform = new TranslateTransform(student.XTransform, student.YTransform);
            this.RenderTransform = this.Transform;
        }

        protected override void OnPointerPressed(PointerPressedEventArgs e)
        {
            this._isPressed = true;
            this.PositionInBlock = e.GetPosition((Visual?)this.Parent);

            this.PositionInBlock = new Point(this.PositionInBlock.X - this.Transform.X, this.PositionInBlock.Y - this.Transform.Y);

            var position = e.GetPosition((Visual?)this.Parent);

            // Debug:
            //this.UpdateCoords();

            base.OnPointerPressed(e);

            if (MainWindow.SelectedSchoolClass is null)
            {
                return;
            }

            if (this.AssignedDesk is not null)
            {
                this.AssignedDesk.AssignedStudent = null;
            }

            this.AssignedDesk = null;

            foreach (CustomMovableDesk desk in MainWindow.SelectedSchoolClass.DeskMovableList)
            {
                desk.Background = new SolidColorBrush(Color.Parse(Constants.CustomGray2));

                if (desk.CheckIfWithinHitbox(position))
                {
                    desk.Background = new SolidColorBrush(Color.Parse(Constants.MomsBlue3));

                    break;
                }
            }
        }

        protected override void OnPointerMoved(PointerEventArgs e)
        {
            if (!this._isPressed || this.Parent == null)
            {
                return;
            }

            var position = e.GetPosition((Visual?)this.Parent);

            double offsetX = position.X - this.PositionInBlock.X;
            double offsetY = position.Y - this.PositionInBlock.Y;

            this.Transform = new TranslateTransform(offsetX, offsetY);
            this.RenderTransform = this.Transform;

            // Debug:
            //this.UpdateCoords();

            base.OnPointerMoved(e);

            if (MainWindow.SelectedSchoolClass is null)
            {
                return;
            }

            List<CustomMovableDesk> deskList = MainWindow.SelectedSchoolClass.DeskMovableList;

            foreach (CustomMovableDesk desk in deskList)
            {
                desk.Background = new SolidColorBrush(Color.Parse(Constants.CustomGray2));

                if (desk.CheckIfWithinHitbox(position))
                {
                    desk.Background = new SolidColorBrush(Color.Parse(Constants.MomsBlue3));

                    break;
                }
            }
        }

        protected override void OnPointerReleased(PointerReleasedEventArgs e)
        {
            this._isPressed = false;

            base.OnPointerReleased(e);

            this.UpdateStudent();

            if (MainWindow.SelectedSchoolClass is null)
            {
                return;
            }

            var position = e.GetPosition((Visual?)this.Parent);

            // Debug:
            //this.UpdateCoords();

            List<CustomMovableDesk> deskList = MainWindow.SelectedSchoolClass.DeskMovableList;

            CustomMovableDesk? foundDesk = null;
            foreach (CustomMovableDesk desk in deskList)
            {
                desk.Background = new SolidColorBrush(Color.Parse(Constants.CustomGray2));

                if (desk.CheckIfWithinHitbox(position))
                {
                    foundDesk = desk;

                    break;
                }
            }

            if (foundDesk is null)
            {
                return;
            }

            foundDesk.AssignedStudent = this;
            this.AssignedDesk = foundDesk;

            this.PositionInBlock = new Point(foundDesk.Transform.X + 10, foundDesk.Transform.Y + 11);
            this.Transform = new TranslateTransform(foundDesk.Transform.X + 10, foundDesk.Transform.Y + 11);
            this.RenderTransform = this.Transform;

            this.UpdateStudent();
        }

        public void UpdateCoords()
        {
            DockPanel foundChildDock = (DockPanel)this.Child!;

            Label? foundChildLabel = (Label)foundChildDock.Children.FirstOrDefault(x => x is Label)!;

            if (foundChildLabel is null)
            {
                return;
            }

            foundChildLabel.Content = "X: " + this.Transform.X + " Y: " + this.Transform.Y;
        }

        public void UpdateStudent()
        {
            this._Student.XTransform = this.Transform.X;
            this._Student.YTransform = this.Transform.Y;
        }
    }
}