using Avalonia;
using Avalonia.Controls;
using Avalonia.Input;
using Avalonia.Media;
using System.Linq;
using TeacherStudentTracker.Data;
using TeacherStudentTracker.Views;

namespace Controls
{
    public class CustomMovableDesk : Border
    {
        private bool _isPressed;

        private MainWindow _mainWindow { get; set; }

        private static int CurrentID { get; set; } = 0;

        public Point PositionInBlock { get; set; }

        public TranslateTransform Transform { get; set; } = new TranslateTransform(0, 0);

        public CustomMovableStudent? AssignedStudent { get; set; } = null;

        public int ID { get; set; }

        public Desk _DeskObject { get; set; }

        public CustomMovableDesk()
        {
            // DO NOT USE THIS CONSTRUCTOR. This is only for development purposes and this object will not work if you use this one.
            this._mainWindow = null!;
            this._DeskObject = null!;
        }

        public CustomMovableDesk(MainWindow mainWindow, Desk desk)
        {
            this.ID = CurrentID;
            CurrentID++;

            this._mainWindow = mainWindow;
            this._DeskObject = desk;

            this.Transform = new TranslateTransform(desk.XTransform, desk.YTransform);
            this.RenderTransform = this.Transform;
        }

        protected override void OnPointerPressed(PointerPressedEventArgs e)
        {
            this._isPressed = true;
            this.PositionInBlock = e.GetPosition((Visual?)this.Parent);

            this.PositionInBlock = new Point(this.PositionInBlock.X - this.Transform.X, this.PositionInBlock.Y - this.Transform.Y);

            // Debug:
            //this.UpdateCoords();

            base.OnPointerPressed(e);
        }

        protected override void OnPointerMoved(PointerEventArgs e)
        {
            if (!this._isPressed || this.Parent == null || this._mainWindow is null)
            {
                return;
            }

            var position = e.GetPosition((Visual?)this.Parent);

            double offsetX = position.X - this.PositionInBlock.X;
            double offsetY = position.Y - this.PositionInBlock.Y;

            if ((bool)this._mainWindow.lockToGridCheckbox.IsChecked!)
            {
                offsetX = offsetX - 8 - (offsetX % (double)(this._mainWindow.gridSizeNumeric.Value * 10)!);
                offsetY = offsetY - 4 - (offsetY % (double)(this._mainWindow.gridSizeNumeric.Value * 10)!);
            }

            this.Transform = new TranslateTransform(offsetX, offsetY);
            this.RenderTransform = this.Transform;

            // Debug:
            //this.UpdateCoords();

            base.OnPointerMoved(e);

            if (this.AssignedStudent is not null)
            {
                this.AssignedStudent.PositionInBlock = new Point(this.Transform.X + 10, this.Transform.Y + 11);
                this.AssignedStudent.Transform = new TranslateTransform(this.Transform.X + 10, this.Transform.Y + 11);
                this.AssignedStudent.RenderTransform = this.AssignedStudent.Transform;
            }
        }

        protected override void OnPointerReleased(PointerReleasedEventArgs e)
        {
            this._isPressed = false;

            // Debug:
            //this.UpdateCoords();

            base.OnPointerReleased(e);

            if (this.AssignedStudent is not null)
            {
                this.AssignedStudent.PositionInBlock = new Point(this.Transform.X + 10, this.Transform.Y + 11);
                this.AssignedStudent.Transform = new TranslateTransform(this.Transform.X + 10, this.Transform.Y + 11);
                this.AssignedStudent.RenderTransform = this.AssignedStudent.Transform;

                this.AssignedStudent.UpdateStudent();
            }

            this.UpdateDesk();
        }

        public (Point, Point) GetHitBox()
        {
            return (new Point(this.Transform.X, this.Transform.Y), new Point(this.Transform.X + this.Width, this.Transform.Y + this.Height));
        }

        public bool CheckIfWithinHitbox(Point point)
        {
            (Point topLeft, Point bottomRight) hitBox = this.GetHitBox();

            if (point.X < hitBox.topLeft.X || point.X > hitBox.bottomRight.X)
            {
                return false;
            }

            if (point.Y < hitBox.topLeft.Y || point.Y > hitBox.bottomRight.Y)
            {
                return false;
            }

            return true;
        }

        public void UpdateCoords()
        {
            DockPanel foundChildDock = (DockPanel)this.Child!;

            TextBox? foundChildLabel = (TextBox)foundChildDock.Children.FirstOrDefault(x => x is TextBox)!;

            if (foundChildLabel is null)
            {
                return;
            }

            foundChildLabel.Text = "X: " + this.Transform.X + " Y: " + this.Transform.Y;
        }

        public void UpdateDesk()
        {
            this._DeskObject.XTransform = this.Transform.X;
            this._DeskObject.YTransform = this.Transform.Y;
            this._DeskObject.AssignedStudentID = this.AssignedStudent is not null ? this.AssignedStudent._Student.ID : null;

            DockPanel foundChildDock = (DockPanel)this.Child!;

            TextBox? foundChildTextBox = (TextBox)foundChildDock.Children.FirstOrDefault(x => x is TextBox)!;

            if (foundChildTextBox is null)
            {
                return;
            }

            this._DeskObject.DeskNumber = foundChildTextBox.Text is not null ? foundChildTextBox.Text : string.Empty;
        }
    }
}