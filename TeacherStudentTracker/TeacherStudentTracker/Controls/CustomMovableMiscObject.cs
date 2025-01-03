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
    public class CustomMovableMiscObject : Border
    {
        private bool _isPressed;

        private MainWindow _mainWindow { get; set; }

        private static int CurrentID { get; set; } = 0;

        public Point PositionInBlock { get; set; }

        public TranslateTransform Transform { get; set; } = new TranslateTransform(0, 0);

        public int ID { get; set; }

        public string GivenName { get; set; } = string.Empty;

        public (bool left, bool right, bool top, bool bottom) EdgeMode { get; set; } = (false, false, false, false);

        public MiscObject _MiscObject { get; set; }

        public CustomMovableMiscObject()
        {
            // DO NOT USE THIS CONSTRUCTOR. This is only for development purposes and this object will not work if you use this one.
            this._mainWindow = null!;
            this._MiscObject = null!;
        }

        public CustomMovableMiscObject(MainWindow mainWindow, MiscObject miscObject)
        {
            this._mainWindow = mainWindow;
            this._MiscObject = miscObject;

            this.GivenName = miscObject.ObjectName;
            this.Width = miscObject.Width;
            this.Height = miscObject.Height;
            this.Transform = new TranslateTransform(miscObject.XTransform, miscObject.YTransform);
            this.RenderTransform = this.Transform;
        }

        protected override void OnPointerPressed(PointerPressedEventArgs e)
        {
            this.ID = CurrentID;
            CurrentID++;

            this._isPressed = true;
            this.PositionInBlock = e.GetPosition((Visual?)this.Parent);

            this.PositionInBlock = new Point(this.PositionInBlock.X - this.Transform.X, this.PositionInBlock.Y - this.Transform.Y);

            // Debug:
            //this.UpdateCoords();

            base.OnPointerPressed(e);
        }

        protected override void OnPointerExited(PointerEventArgs e)
        {
            if (this.Parent == null)
            {
                return;
            }

            Panel panel = (Panel)this.Child!;
            List<Border> borderList = panel.Children.Where(x => x is Border).ToList().ConvertAll(x => x as Border)!;
            foreach (Border border in borderList)
            {
                border.Background = new SolidColorBrush(Color.Parse(Constants.CustomGray2));
            }

            _ = this.EdgeDetection(e);

            TextBox foundTextBox = (TextBox)panel.Children.FirstOrDefault(x => x is TextBox)!;
            this.GivenName = foundTextBox.Text is not null ? foundTextBox.Text : string.Empty;
        }

        protected override void OnPointerMoved(PointerEventArgs e)
        {
            if (this.Parent == null || this._mainWindow is null)
            {
                return;
            }

            if (!this._isPressed)
            {
                this.EdgeMode = this.EdgeDetection(e);

                return;
            }

            var position = e.GetPosition((Visual?)this.Parent);

            if (!(this.EdgeMode.left || this.EdgeMode.right || this.EdgeMode.top || this.EdgeMode.bottom))
            {
                double offsetX = position.X - this.PositionInBlock.X;
                double offsetY = position.Y - this.PositionInBlock.Y;

                if ((bool)this._mainWindow.lockToGridCheckbox.IsChecked!)
                {
                    offsetX = offsetX - 8 - (offsetX % (double)(this._mainWindow.gridSizeNumeric.Value * 10)!);
                    offsetY = offsetY - 4 - (offsetY % (double)(this._mainWindow.gridSizeNumeric.Value * 10)!);
                }

                this.Transform = new TranslateTransform(offsetX, offsetY);
                this.RenderTransform = this.Transform;

                base.OnPointerMoved(e);

                Panel panel = (Panel)this.Child!;
                List<Border> borderList = panel.Children.Where(x => x is Border).ToList().ConvertAll(x => x as Border)!;
                foreach (Border border in borderList)
                {
                    border.Background = new SolidColorBrush(Color.Parse(Constants.CustomGray2));
                }
            }

            if (this.EdgeMode.left)
            {
                double newWidth = this.Transform.X + this.PositionInBlock.X + this.Width - position.X;
                this.Width = newWidth >= 30 ? newWidth : 30;

                double offsetX = position.X - this.PositionInBlock.X;
                this.Transform = new TranslateTransform(offsetX, this.Transform.Y);
                this.RenderTransform = this.Transform;
            }

            if (this.EdgeMode.right)
            {
                double newWidth = position.X - this.Transform.X + 10;
                this.Width = newWidth >= 30 ? newWidth : 30;
            }

            if (this.EdgeMode.top)
            {
                double newHeight = this.Transform.Y + this.PositionInBlock.Y + this.Height - position.Y;
                this.Height = newHeight >= 30 ? newHeight : 30;

                double offsetY = position.Y - this.PositionInBlock.Y;
                this.Transform = new TranslateTransform(this.Transform.X, offsetY);
                this.RenderTransform = this.Transform;
            }

            if (this.EdgeMode.bottom)
            {
                double newHight = position.Y - this.Transform.Y + 10;
                this.Height = newHight >= 30 ? newHight : 30;
            }
        }
        protected override void OnPointerReleased(PointerReleasedEventArgs e)
        {
            this._isPressed = false;

            base.OnPointerReleased(e);

            this.UpdateMiscObject();
        }

        public (bool left, bool right, bool top, bool bottom) EdgeDetection(PointerEventArgs e)
        {
            var position = e.GetPosition((Visual?)this.Parent);

            double offsetX = position.X - this.Transform.X;
            double offsetY = position.Y - this.Transform.Y;

            if (MainWindow.SelectedSchoolClass is null)
            {
                return (false, false, false, false);
            }

            if (!this.CheckIfWithinHitbox(position))
            {
                return (false, false, false, false);
            }

            Panel panel = (Panel)this.Child!;
            List<Border> borderList = panel.Children.Where(x => x is Border).ToList().ConvertAll(x => x as Border)!;
            foreach (Border border in borderList)
            {
                border.Background = new SolidColorBrush(Color.Parse(Constants.CustomGray2));
            }

            this.Cursor = Cursor.Default;

            (bool left, bool right, bool top, bool bottom) edge = (false, false, false, false);

            Border? foundBorder = null;
            if (offsetX > -5 && offsetX < 15)
            {
                foundBorder = borderList.FirstOrDefault(x => x.Name![13..] == "Left");

                if (foundBorder is not null)
                {
                    foundBorder.Background = new SolidColorBrush(Color.Parse(Constants.MomsBlue3));
                }

                this.Cursor = new Cursor(StandardCursorType.SizeWestEast);
                edge.left = true;
            }

            if (offsetX > this.Width - 15 && offsetX < this.Width + 5)
            {
                foundBorder = borderList.FirstOrDefault(x => x.Name![13..] == "Right");

                if (foundBorder is not null)
                {
                    foundBorder.Background = new SolidColorBrush(Color.Parse(Constants.MomsBlue3));
                }

                this.Cursor = new Cursor(StandardCursorType.SizeWestEast);
                edge.right = true;
            }

            if (offsetY > -5 && offsetY < 15)
            {
                foundBorder = borderList.FirstOrDefault(x => x.Name![13..] == "Top");

                if (foundBorder is not null)
                {
                    foundBorder.Background = new SolidColorBrush(Color.Parse(Constants.MomsBlue3));
                }

                this.Cursor = new Cursor(StandardCursorType.SizeNorthSouth);
                edge.top = true;
            }

            if (offsetY > this.Height - 15 && offsetY < this.Height + 5)
            {
                foundBorder = borderList.FirstOrDefault(x => x.Name![13..] == "Bottom");

                if (foundBorder is not null)
                {
                    foundBorder.Background = new SolidColorBrush(Color.Parse(Constants.MomsBlue3));
                }

                this.Cursor = new Cursor(StandardCursorType.SizeNorthSouth);
                edge.bottom = true;
            }

            if (edge.left && edge.top)
            {
                this.Cursor = new Cursor(StandardCursorType.TopLeftCorner);
            }
            else if (edge.top && edge.right)
            {
                this.Cursor = new Cursor(StandardCursorType.TopRightCorner);
            }
            else if (edge.right && edge.bottom)
            {
                this.Cursor = new Cursor(StandardCursorType.BottomRightCorner);
            }
            else if (edge.bottom && edge.left)
            {
                this.Cursor = new Cursor(StandardCursorType.BottomLeftCorner);
            }

            return edge;
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

        public void UpdateMiscObject()
        {
            this._MiscObject.XTransform = this.Transform.X;
            this._MiscObject.YTransform = this.Transform.Y;
            this._MiscObject.Width = this.Width;
            this._MiscObject.Height = this.Height;

            Panel foundChildDock = (Panel)this.Child!;

            TextBox? foundChildTextBox = (TextBox)foundChildDock.Children.FirstOrDefault(x => x is TextBox)!;

            if (foundChildTextBox is null)
            {
                return;
            }

            this._MiscObject.ObjectName = foundChildTextBox.Text is not null ? foundChildTextBox.Text : string.Empty;
        }
    }
}