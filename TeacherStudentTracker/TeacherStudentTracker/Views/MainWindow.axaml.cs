using Avalonia.Controls;
using Avalonia.ReactiveUI;
using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using TeacherStudentTracker.Data;
using TeacherStudentTracker.ViewModels;
using System.Threading.Tasks;
using System.Reactive.Linq;
using Controls;
using Avalonia.Media;
using Newtonsoft.Json;
using System.IO;
using Avalonia.Platform.Storage;
using Avalonia.Controls.Shapes;
using Avalonia.Interactivity;
using Avalonia;
namespace TeacherStudentTracker.Views;

public partial class MainWindow : ReactiveWindow<MainWindowViewModel>
{
    public List<SchoolClass> SchoolClasses { get; set; } = [];

    public static SchoolClass? SelectedSchoolClass { get; set; }

    public ICommand EditStudentCommand { get; set; }

    public ICommand DeleteStudentCommand { get; set; }

    public int NumberOfStudentComuns { get; set; } = 5;

    public int NumberOfStudentRows { get; set; } = 1;

    public MainWindow()
    {
        try
        {
            this.InitializeComponent();

            this.classListBox.ItemsSource = Array.Empty<string>();
            this.startingPromptTextBlock.Text = Constants.StringNoClassSelected;
            this.startingPromptTextBlock2.Text = Constants.StringNoClassSelected;

            ICommand NewStudentCommand = ReactiveCommand.CreateFromTask(() =>
            {
                // Debug:
                //this.TestErrorHandler(false);
                //return Task.CompletedTask;

                if (SelectedSchoolClass is null)
                {
                    return Task.CompletedTask;
                }

                List<CustomField> customFields = [];
                foreach(string s in SelectedSchoolClass.CustomFields)
                {
                    customFields.Add(new CustomField(s, ValidFieldTypes.Text));
                    customFields.Last().Data = "";
                }

                var newStudent = new Student(null, string.Empty, string.Empty, customFields, null, 0, 0);

                this.OpenNewStudentPage(newStudent);

                return Task.CompletedTask;
            });

            ICommand NewSchoolClassCommand = ReactiveCommand.CreateFromTask(() =>
            {
                this.OpenNewSchoolClassPage("New Class");

                return Task.CompletedTask;
            });

            ICommand DeleteClassCommand = ReactiveCommand.CreateFromTask(() =>
            {
                if (SelectedSchoolClass is not null)
                {
                    this.RemoveSchoolClass(SelectedSchoolClass);
                }

                return Task.CompletedTask;
            });

            ICommand DuplicateClassCommand = ReactiveCommand.CreateFromTask(() =>
            {
                if (SelectedSchoolClass is not null)
                {
                    this.DupeSchoolClass(SelectedSchoolClass);
                }

                return Task.CompletedTask;
            });

            ICommand EditClassCommand = ReactiveCommand.CreateFromTask(() =>
            {
                if (SelectedSchoolClass is not null)
                {
                    EditSchoolClass(SelectedSchoolClass);
                }

                return Task.CompletedTask;
            });

            ICommand loadSchoolClassCommand = ReactiveCommand.CreateFromTask(() =>
            {
                this.LoadClass();

                return Task.CompletedTask;
            });

            ICommand NewDeskCommand = ReactiveCommand.CreateFromTask(() =>
            {
                this.CreateNewDeskMoveable();

                return Task.CompletedTask;
            });

            ICommand NewMiscCommand = ReactiveCommand.CreateFromTask(() =>
            {
                this.AddMiscObject();

                return Task.CompletedTask;
            });

            ICommand SaveAsSchoolClassCommand = ReactiveCommand.CreateFromTask(() => {
                try
                {
                    if (SelectedSchoolClass is null)
                    {
                        return Task.CompletedTask;
                    }

                    SaveAsClass(SelectedSchoolClass);
                }
                catch (Exception ex)
                {
                    GenericHelpers.HandleError(this, ex.Message);
                }

                return Task.CompletedTask;
            });

            ICommand saveSchoolClassCommand = ReactiveCommand.CreateFromTask(() =>
            {
                try
                {
                    if (SelectedSchoolClass is null)
                    {
                        return Task.CompletedTask;
                    }

                    GenericHelpers.SaveClass(SelectedSchoolClass);
                }
                catch (Exception ex)
                {
                    GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
                }

                return Task.CompletedTask;
            });

            var bounds = this.GetObservable(Canvas.BoundsProperty);
            bounds.Subscribe(value =>
            {
                this.AdjustStudentViewColumns();
                this.AdjustStudentViewRows();
            });

            this.EditStudentCommand = ReactiveCommand.Create<int>(this.EditStudentPage);

            DeleteStudentCommand = ReactiveCommand.Create<int>(DeleteStudent);

            this.DataContext = new MainWindowViewModel(NewStudentCommand, NewSchoolClassCommand, loadSchoolClassCommand, saveSchoolClassCommand, this.EditStudentCommand, NewDeskCommand, DeleteClassCommand, DuplicateClassCommand, NewMiscCommand, EditClassCommand, SaveAsSchoolClassCommand, DeleteStudentCommand);
        }
        catch (Exception ex)
        {
            this.EditStudentCommand = null!;
            DeleteStudentCommand = null!;

            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace, true);
        }
    }
    public async void SaveAsClass(SchoolClass schoolClass)
    {
        try
        {
            if (schoolClass is null) return;
            // Get top level from the current control. Alternatively, you can use Window reference instead.
            TopLevel topLevel = GetTopLevel(this)!;

            FilePickerFileType JSONFileType = new("JSON")
            {
                Patterns = ["*.json"],
                AppleUniformTypeIdentifiers = ["public.json"],
                MimeTypes = ["application/json"]
            };

            // Start async operation to open the dialog.
            var file = await topLevel.StorageProvider.SaveFilePickerAsync(new FilePickerSaveOptions
            {
                Title = "Select Saved Class File",
                DefaultExtension = ".json",
                FileTypeChoices = [JSONFileType],
                SuggestedStartLocation = await topLevel.StorageProvider.TryGetFolderFromPathAsync(Constants.SaveFolder)
            });

            if (file is null)
            {
                return;
            }

            schoolClass.SaveName = file.Name;

            string jString = JsonConvert.SerializeObject(schoolClass, Formatting.Indented);
            Stream stream = await file.OpenWriteAsync();
            using var streamWriter = new StreamWriter(stream);
            await streamWriter.WriteLineAsync(jString);
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message);
        }
    }

    public async void LoadClass()
    {
        try
        {
            // Get top level from the current control. Alternatively, you can use Window reference instead.
            TopLevel topLevel = GetTopLevel(this)!;

            FilePickerFileType JSONFileType = new("JSON")
            {
                Patterns = ["*.json"],
                AppleUniformTypeIdentifiers = ["public.json"],
                MimeTypes = ["application/json"]
            };

            // Start async operation to open the dialog.
            IReadOnlyList<IStorageFile> files = await topLevel.StorageProvider.OpenFilePickerAsync(new FilePickerOpenOptions
            {
                Title = "Save File As",
                AllowMultiple = false,
                FileTypeFilter = [JSONFileType],
                SuggestedStartLocation = await topLevel.StorageProvider.TryGetFolderFromPathAsync(Constants.SaveFolder)
            });

            if (files.Count < 1)
            {
                return;
            }

            Stream coverStream = await files[0].OpenReadAsync();
            StreamReader reader = new(coverStream);
            string jString = reader.ReadToEnd();

            SchoolClass? loadedSchoolClass = JsonConvert.DeserializeObject<SchoolClass>(jString);
            if (loadedSchoolClass is null)
            {
                return;
            }

            loadedSchoolClass.CurrentStudentID = loadedSchoolClass.Students.Last().ID + 1;
            loadedSchoolClass.CurrentDeskID = loadedSchoolClass.Desks.Count > 0 ? loadedSchoolClass.Desks.Last().ID + 1 : 0;
            loadedSchoolClass.CurrentMiscObjectID = loadedSchoolClass.MiscObjects.Count > 0 ? loadedSchoolClass.MiscObjects.Last().ID + 1 : 0;

            this.LoadSeatingChartObjects();

            this.AddNewSchoolClass(loadedSchoolClass);
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void DeleteStudent(int studentID)
    {
        try
        {
            if (SelectedSchoolClass is null) return;
            Student? student = SelectedSchoolClass!.Students.FirstOrDefault(x => x.ID == studentID);
            if (student is null) return;

            SelectedSchoolClass.Students.Remove(student);
            SelectedSchoolClass.Students = SelectedSchoolClass.Students.OrderBy(x => x.FirstNames).ThenBy(x => x.LastName).ToList();

            RemakeStudentButtons();
            List<CustomMovableStudent> childControlList = this.seatingChartMainBox.Children.Where(x => x is CustomMovableStudent).ToList().ConvertAll(x => x as CustomMovableStudent)!;
            CustomMovableStudent? studentMovable = childControlList.FirstOrDefault(x => x._Student.ID == studentID);
            if (studentMovable is null)
            {
                throw new Exception("Error: student list and studentmovable list mismatch");
            }

            seatingChartMainBox.Children.Remove(studentMovable);
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public async void EditStudentPage(int studentID)
    {
        try
        {
            if (SelectedSchoolClass is null)
            {
                return;
            }

            Student? student = SelectedSchoolClass!.Students.FirstOrDefault(x => x.ID == studentID);

            if (student is null)
            {
                return;
            }

            var newStudentWindow = new NewStudentWindow();

            newStudentWindow.SetSelectedStudent(student);

            await newStudentWindow.ShowDialog(this);

            SelectedSchoolClass.Students = SelectedSchoolClass.Students.OrderBy(x => x.FirstNames).ThenBy(x => x.LastName).ToList();

            this.RemakeStudentButtons();
            this.UpdateStudentMoveable(student);
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Opens a new student creation/edit window.
    /// </summary>
    public async void OpenNewStudentPage(Student student)
    {
        try
        {
            var newStudentWindow = new NewStudentWindow();
            newStudentWindow.SetSelectedStudent(student);

            await newStudentWindow.ShowDialog(this);
            if (student.Save)
            this.AddNewStudentToCurrentClass(student);

            // .ShowDialog() is used to prevent the user from leaving the given window.
            // .Show() is for when you want to allow the user to still access the main window.
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Creates a new student object, adds it to the currently selected class, then remakes the student buttons.
    /// </summary>
    public void AddNewStudentToCurrentClass(Student newStudent)
    {
        try
        {
            if (SelectedSchoolClass is null)
            {
                this.startingPromptTextBlock.Text = Constants.StringNoClassSelected;
                this.startingPromptTextBlock2.Text = Constants.StringNoClassSelected;

                return;
            }

            SelectedSchoolClass.Students.Add(newStudent);

            SelectedSchoolClass.Students = SelectedSchoolClass.Students.OrderBy(x => x.FirstNames).ThenBy(x => x.LastName).ToList();

            this.AdjustStudentViewRows();

            this.RemakeStudentButtons();
            this.CreateNewStudentMoveable(newStudent);
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Remakes all of the student buttons displayed on the main tab on the right.
    /// </summary>
    public void RemakeStudentButtons()
    {
        try
        {
            if (SelectedSchoolClass is null)
            {
                this.studentsGrid.Children.Clear();
                this.startingPromptTextBlock.Text = Constants.StringNoClassSelected;
                this.startingPromptTextBlock2.Text = Constants.StringNoClassSelected;

                return;
            }

            this.studentsGrid.Children.Clear();

            if (SelectedSchoolClass.Students.Count <= 0)
            {
                this.startingPromptTextBlock.Text = Constants.StringNoStudentsYet;
                this.startingPromptTextBlock2.Text = Constants.StringNoStudentsYet;

                return;
            }

            this.startingPromptTextBlock.Text = string.Empty;
            this.startingPromptTextBlock2.Text = string.Empty;

            int x = 0;
            int y = 0;

            foreach (Student student in SelectedSchoolClass.Students)
            {
                // Make the Student view buttons:

                ContextMenu rightClick = new();
                MenuItem delete = new();
                delete.Header = "Delete";
                delete.Command = DeleteStudentCommand;
                delete.CommandParameter = student.ID;
                rightClick.Items.Add(delete);

                Image newStudentImage = new();
                newStudentImage.Classes.Add("studentStyle");
                newStudentImage.Source = student.Picture;

                TextBlock newStudentTextBlock = new();
                newStudentTextBlock.Classes.Add("studentStyle");
                newStudentTextBlock.Text = student.FirstNames + " " + student.LastName;

                Panel newStudentPanel = new();
                newStudentPanel.Classes.Add("studentStyle");
                newStudentPanel.Children.Add(newStudentImage);
                newStudentPanel.Children.Add(newStudentTextBlock);

                Button newStudentButton = new();
                newStudentButton.SetValue(Grid.ColumnProperty, x);
                newStudentButton.SetValue(Grid.RowProperty, y);
                newStudentButton.Classes.Add("studentStyle");
                newStudentButton.Command = this.EditStudentCommand;
                newStudentButton.CommandParameter = student.ID;
                newStudentButton.Content = newStudentPanel;
                newStudentButton.ContextMenu = rightClick;

                this.studentsGrid.Children.Add(newStudentButton);

                x++;
                if (x >= this.NumberOfStudentComuns)
                {
                    x = 0;
                    y++;
                }
            }
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Make the seating chart view movable controls.
    /// </summary>
    public void CreateNewStudentMoveable(Student student)
    {
        try
        {
            Image newStudentImage = new();
            newStudentImage.Classes.Add("studentStyle2");
            newStudentImage.Source = student.Picture;

            Label newStudentLabel = new();
            newStudentLabel.Classes.Add("studentStyle2");
            newStudentLabel.Content = student.FirstNames + " " + student.LastName;

            DockPanel newStudentDockPanel = new();
            newStudentDockPanel.Name = "_" + student.ID.ToString() + "SeatingChild";
            newStudentDockPanel.Children.Add(newStudentImage);
            newStudentDockPanel.Children.Add(newStudentLabel);

            CustomMovableStudent newStudentMovable = new(student);
            newStudentMovable.Child = newStudentDockPanel;
            newStudentMovable.Background = new SolidColorBrush(Color.Parse(Constants.CustomGray3));
            newStudentMovable.HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Left;
            newStudentMovable.VerticalAlignment = Avalonia.Layout.VerticalAlignment.Top;
            newStudentMovable.CornerRadius = new Avalonia.CornerRadius(5);
            newStudentMovable.Height = 135;
            newStudentMovable.Width = 120;
            newStudentMovable.BorderBrush = new SolidColorBrush(Color.Parse("Black"));
            newStudentMovable.BorderThickness = new Avalonia.Thickness(1);
            newStudentMovable.Transform = new(student.XTransform, student.YTransform);
            newStudentMovable.RenderTransform = newStudentMovable.Transform;

            this.seatingChartMainBox.Children.Add(newStudentMovable);
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Check if we already have an entry for the student and update that moveable instead.
    /// </summary>
    /// <param name="student"></param>
    public void UpdateStudentMoveable(Student student)
    {
        try
        {
            List<CustomMovableStudent> childControlList = this.seatingChartMainBox.Children.Where(x => x is CustomMovableStudent).ToList().ConvertAll(x => x as CustomMovableStudent)!;
            List<DockPanel> childDockList = childControlList.Select(x => x.Child).ToList().ConvertAll(x => x as DockPanel)!;

            if (childDockList.Count <= 0)
            {
                return;
            }

            DockPanel? foundChildDock = childDockList.FirstOrDefault(x => x.Name![1].ToString() == student.ID.ToString());

            if (foundChildDock is null || foundChildDock.Children.Count <= 0)
            {
                return;
            }

            Label? foundChildLabel = (Label)foundChildDock.Children.FirstOrDefault(x => x is Label)!;

            if (foundChildLabel is null)
            {
                return;
            }

            foundChildLabel.Content = student.FirstNames + " " + student.LastName;

            Image? foundChildImage = (Image)foundChildDock.Children.FirstOrDefault(x => x is Image)!;

            if (foundChildImage is null)
            {
                return;
            }

            foundChildImage.Source = student.Picture;
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Make the seating chart view movable controls.
    /// </summary>
    public void CreateNewDeskMoveable(Desk? desk = null)
    {
        try
        {
            if (SelectedSchoolClass is null)
            {
                this.startingPromptTextBlock.Text = Constants.StringNoClassSelected;
                this.startingPromptTextBlock2.Text = Constants.StringNoClassSelected;

                return;
            }

            Border newDeskBorder = new();
            newDeskBorder.Classes.Add("deskStyle");

            TextBox newDeskTextBox = new();
            newDeskTextBox.Classes.Add("deskStyle");

            Desk newDesk;
            if (desk is null)
            {
                newDesk = new();
                SelectedSchoolClass.Desks.Add(newDesk);
            }
            else
            {
                newDesk = desk;

                newDeskTextBox.Text = newDesk.DeskNumber;
            }

            MenuItem newDeleteItemControl = new();
            newDeleteItemControl.Header = "Delete";

            ContextMenu newContextMenu = new();
            newContextMenu.Items.Add(newDeleteItemControl);

            CustomMovableDesk newDeskMovable = new(this, newDesk);
            newDeskMovable.Background = new SolidColorBrush(Color.Parse(Constants.CustomGray2));
            newDeskMovable.CornerRadius = new Avalonia.CornerRadius(5);
            newDeskMovable.Height = 200;
            newDeskMovable.Width = 140;
            newDeskMovable.BorderBrush = new SolidColorBrush(Color.Parse("Black"));
            newDeskMovable.BorderThickness = new Avalonia.Thickness(1);
            newDeskMovable.HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Left;
            newDeskMovable.VerticalAlignment = Avalonia.Layout.VerticalAlignment.Top;
            newDeskMovable.Transform = new(newDesk.XTransform, newDesk.YTransform);
            newDeskMovable.RenderTransform = newDeskMovable.Transform;
            newDeskMovable.ContextMenu = newContextMenu;
            
            newDeleteItemControl.Command = ReactiveCommand.CreateFromTask(() =>
            {
                this.DeleteDesk(newDeskMovable);

                return Task.CompletedTask;
            });

            if (newDesk.AssignedStudentID is not null)
            {
                List<CustomMovableStudent> movableStudents = this.seatingChartMainBox.Children.Where(x  => x is CustomMovableStudent).ToList().ConvertAll(x => x as CustomMovableStudent)!;
                newDeskMovable.AssignedStudent = movableStudents.FirstOrDefault(x => x._Student.ID == newDesk.AssignedStudentID);

                if (newDeskMovable.AssignedStudent is not null)
                {
                    newDeskMovable.AssignedStudent.AssignedDesk = newDeskMovable;
                }
            }

            newDeskTextBox.KeyUp += (sender, e) =>
            {
                newDeskMovable.UpdateDesk();
            };

            DockPanel newDeskDockPanel = new();
            newDeskDockPanel.Name = "_" + newDeskMovable.ID.ToString() + "Desk";
            newDeskDockPanel.Children.Add(newDeskBorder);
            newDeskDockPanel.Children.Add(newDeskTextBox);

            newDeskMovable.Child = newDeskDockPanel;

            this.seatingChartDeskBox.Children.Add(newDeskMovable);
            SelectedSchoolClass.DeskMovableList.Add(newDeskMovable);
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void DeleteDesk(CustomMovableDesk deskMovable)
    {
        if (SelectedSchoolClass is null)
        {
            return;
        }

        SelectedSchoolClass.Desks.Remove(deskMovable._DeskObject);
        SelectedSchoolClass.DeskMovableList.Remove(deskMovable);
        this.seatingChartDeskBox.Children.Remove(deskMovable);

        deskMovable.IsVisible = false;
    }

    public void DeleteMiscObject(CustomMovableMiscObject miscMovable)
    {
        if (SelectedSchoolClass is null)
        {
            return;
        }

        SelectedSchoolClass.MiscObjects.Remove(miscMovable._MiscObject);
        SelectedSchoolClass.MiscObjectMovableList.Remove(miscMovable);
        this.seatingChartMiscBox.Children.Remove(miscMovable);

        miscMovable.IsVisible = false;
    }

    public void AddMiscObject(MiscObject? miscObject = null)
    {
        try
        {
            if (SelectedSchoolClass is null)
            {
                this.startingPromptTextBlock.Text = Constants.StringNoClassSelected;
                this.startingPromptTextBlock2.Text = Constants.StringNoClassSelected;

                return;
            }

            MiscObject newMiscObject;
            if (miscObject is null)
            {
                newMiscObject = new();
                SelectedSchoolClass.MiscObjects.Add(newMiscObject);
            }
            else
            {
                newMiscObject = miscObject;
            }

            MenuItem newDeleteItemControl = new();
            newDeleteItemControl.Header = "Delete";

            ContextMenu newContextMenu = new();
            newContextMenu.Items.Add(newDeleteItemControl);

            CustomMovableMiscObject newMovableMiscObject = new(this, newMiscObject);
            newMovableMiscObject.Background = new SolidColorBrush(Color.Parse(Constants.CustomGray2));
            newMovableMiscObject.CornerRadius = new Avalonia.CornerRadius(5);
            newMovableMiscObject.Width = newMiscObject.Width;
            newMovableMiscObject.Height = newMiscObject.Height;
            newMovableMiscObject.BorderBrush = new SolidColorBrush(Color.Parse("Black"));
            newMovableMiscObject.BorderThickness = new Avalonia.Thickness(1);
            newMovableMiscObject.HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Left;
            newMovableMiscObject.VerticalAlignment = Avalonia.Layout.VerticalAlignment.Top;
            newMovableMiscObject.Transform = new(newMiscObject.XTransform, newMiscObject.YTransform);
            newMovableMiscObject.RenderTransform = newMovableMiscObject.Transform;
            newMovableMiscObject.ContextMenu = newContextMenu;

            newDeleteItemControl.Command = ReactiveCommand.CreateFromTask(() =>
            {
                this.DeleteMiscObject(newMovableMiscObject);

                return Task.CompletedTask;
            });

            Border newBorderLeft = new();
            newBorderLeft.Classes.Add("miscObjectStyle");
            newBorderLeft.Name = "_" + newMovableMiscObject.ID.ToString() + "MiscObject" + "_Left";
            newBorderLeft.VerticalAlignment = Avalonia.Layout.VerticalAlignment.Stretch;
            newBorderLeft.HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Left;
            newBorderLeft.Width = 10;

            Border newBorderRight = new();
            newBorderRight.Classes.Add("miscObjectStyle");
            newBorderRight.Name = "_" + newMovableMiscObject.ID.ToString() + "MiscObject" + "_Right";
            newBorderRight.VerticalAlignment = Avalonia.Layout.VerticalAlignment.Stretch;
            newBorderRight.HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Right;
            newBorderRight.Width = 10;

            Border newBorderTop = new();
            newBorderTop.Classes.Add("miscObjectStyle");
            newBorderTop.Name = "_" + newMovableMiscObject.ID.ToString() + "MiscObject" + "_Top";
            newBorderTop.VerticalAlignment = Avalonia.Layout.VerticalAlignment.Top;
            newBorderTop.HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Stretch;
            newBorderTop.Height = 10;

            Border newBorderBottom = new();
            newBorderBottom.Classes.Add("miscObjectStyle");
            newBorderBottom.Name = "_" + newMovableMiscObject.ID.ToString() + "MiscObject" + "_Bottom";
            newBorderBottom.VerticalAlignment = Avalonia.Layout.VerticalAlignment.Bottom;
            newBorderBottom.HorizontalAlignment = Avalonia.Layout.HorizontalAlignment.Stretch;
            newBorderBottom.Height = 10;

            TextBox newMiscTextBox = new();
            newMiscTextBox.Classes.Add("miscObjectStyle");

            if (miscObject is not null)
            {
                newMiscTextBox.Text = miscObject.ObjectName;
            }

            newMiscTextBox.KeyUp += (sender, e) =>
            {
                newMovableMiscObject.UpdateMiscObject();
            };

            Panel newPanel = new();
            newPanel.Name = "_" + newMovableMiscObject.ID.ToString() + "MiscObject";

            newPanel.Children.Add(newMiscTextBox);
            newPanel.Children.Add(newBorderLeft);
            newPanel.Children.Add(newBorderRight);
            newPanel.Children.Add(newBorderTop);
            newPanel.Children.Add(newBorderBottom);

            newMovableMiscObject.Child = newPanel;

            this.seatingChartMiscBox.Children.Add(newMovableMiscObject);
            SelectedSchoolClass.MiscObjectMovableList.Add(newMovableMiscObject);
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void LoadSeatingChartObjects()
    {
        try
        {
            if (SelectedSchoolClass is null)
            {
                return;
            }

            this.seatingChartMainBox.Children.Clear();
            this.seatingChartDeskBox.Children.Clear();
            this.seatingChartMiscBox.Children.Clear();

            SelectedSchoolClass.MiscObjectMovableList.Clear();
            SelectedSchoolClass.DeskMovableList.Clear();

            foreach (Student student in SelectedSchoolClass.Students)
            {
                this.CreateNewStudentMoveable(student);
            }

            foreach (Desk desk in SelectedSchoolClass.Desks)
            {
                this.CreateNewDeskMoveable(desk);
            }

            foreach (MiscObject miscObject in SelectedSchoolClass.MiscObjects)
            {
                this.AddMiscObject(miscObject);
            }
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Takes the size of the window to determine how many columns of students to show.
    /// </summary>
    public void AdjustStudentViewColumns()
    {
        try
        {
            double calculatedWidth = this.Width - 210;

            this.NumberOfStudentComuns = 1;
            if (calculatedWidth >= 250)
            {
                this.NumberOfStudentComuns = Convert.ToInt32(Math.Floor(calculatedWidth / 250));
            }

            string column = "";
            for (int i = 0; i < this.NumberOfStudentComuns; i++)
            {
                column += "250, ";
            }

            column = column[..^2];

            this.studentsGrid.ColumnDefinitions = new ColumnDefinitions(column);

            this.RemakeStudentButtons();
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Takes how many students there are to determine how many rows of students to show.
    /// </summary>
    public void AdjustStudentViewRows()
    {
        try
        {
            if (SelectedSchoolClass is null)
            {
                return;
            }

            double calculatedHeight = this.Height - 70;

            this.NumberOfStudentRows = 1;
            if (SelectedSchoolClass.Students.Count > 0)
            {
                double temp = ((double)SelectedSchoolClass.Students.Count) / ((double)this.NumberOfStudentComuns);
                this.NumberOfStudentRows = Convert.ToInt32(Math.Ceiling(temp));
            }

            string row = "";
            for (int i = 0; i < this.NumberOfStudentRows; i++)
            {
                row += "280, ";
            }

            row = row[..^2];

            this.studentsGrid.RowDefinitions = new RowDefinitions(row);

            this.RemakeStudentButtons();
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Called when a class is selected from the list on the left of the main window.
    /// </summary>
    public void SelectedClassFromList(object sender, SelectionChangedEventArgs args)
    {
        try
        {
            if (this.classListBox.SelectedValue is null)
            {
                return;
            }

            SelectedSchoolClass = this.SchoolClasses[this.classListBox.SelectedIndex];
            this.selectedClassBlock.Text = "Selected Class: " + SelectedSchoolClass.Name;

            if (SelectedSchoolClass.Students.Count <= 0)
            {
                this.startingPromptTextBlock.Text = Constants.StringNoStudentsYet;
                this.startingPromptTextBlock2.Text = Constants.StringNoStudentsYet;
            }
            else
            {
                this.startingPromptTextBlock.Text = string.Empty;
                this.startingPromptTextBlock2.Text = string.Empty;
            }

            this.AdjustStudentViewColumns();
            this.AdjustStudentViewRows();

            this.RemakeStudentButtons();
            this.LoadSeatingChartObjects();
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public async void OpenNewSchoolClassPage(string name)
    {
        try
        {
            var newSchoolClassWindow = new NewSchoolClassWindow(new SchoolClass(name));
            await newSchoolClassWindow.ShowDialog(this);
            if(newSchoolClassWindow.SelectedClass.Save)
            AddNewSchoolClass(newSchoolClassWindow.SelectedClass);
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public async void EditSchoolClass(SchoolClass sc)
    {
        try
        {
            var newSchoolClassWindow = new NewSchoolClassWindow(sc);
            await newSchoolClassWindow.ShowDialog(this);

            List<string> newClassesList = [];
            foreach(SchoolClass s in SchoolClasses)
            {
                newClassesList.Add(s.Name);
            }

            this.classListBox.ItemsSource = newClassesList.ToArray();
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    /// <summary>
    ///     Creates a new school class and adds it to the list on the left of the main window.
    /// </summary>
    public void AddNewSchoolClass(SchoolClass sClass)
    {
        try
        {
            this.SchoolClasses.Add(sClass);
            List<string> newClassesList = [];
            foreach(SchoolClass s in SchoolClasses)
            {
                newClassesList.Add(s.Name);
            }

            this.classListBox.ItemsSource = newClassesList.ToArray();
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void RemoveSchoolClass(SchoolClass sClass)
    {
        try
        {
            this.SchoolClasses.Remove(sClass);
            List<string> newClassesList = [];
            foreach(SchoolClass s in this.SchoolClasses)
            {
                newClassesList.Add(s.Name);
            }

            SelectedSchoolClass = null;
            RemakeStudentButtons();

            this.classListBox.ItemsSource = newClassesList.ToArray();
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void DupeSchoolClass(SchoolClass sClass)
    {
        try
        {
            SchoolClass newClass = new(sClass.Name + "_1")
            {
                Students = new()
            };

            SelectedSchoolClass = newClass;

            sClass.Students.ForEach((item) => {
                newClass.Students.Add((Student)item.Clone());
            });

            this.SchoolClasses.Add(newClass);
            List<string> newClassesList = [];
            foreach(SchoolClass s in SchoolClasses)
            {
                newClassesList.Add(s.Name);
            }

            this.classListBox.ItemsSource = newClassesList.ToArray();
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void DrawLinesOnSnapGrid(object sender, RoutedEventArgs e)
    {
        try
        {
            this.snapGridCanvas.Children.Clear();

            if (!(bool)this.lockToGridCheckbox.IsChecked!)
            {
                return;
            }

            int size = Convert.ToInt32(Math.Floor((Decimal)this.gridSizeNumeric.Value!)) * 10;
            double calculatedWidth = this.Width - 200;
            double calculatedHeight = this.Height - 70;

            for (int i = 0; i < calculatedWidth; i += size)
            {
                Line newLine = new()
                {
                    StartPoint = new Avalonia.Point(i, 0),
                    EndPoint = new Avalonia.Point(i, calculatedHeight),
                    StrokeThickness = 1,
                    Stroke = new SolidColorBrush(Color.Parse("Black")),
                };

                this.snapGridCanvas.Children.Add(newLine);
            }

            for (int i = 0; i < calculatedHeight; i += size)
            {
                Line newLine = new()
                {
                    StartPoint = new Avalonia.Point(0, i),
                    EndPoint = new Avalonia.Point(calculatedWidth, i),
                    StrokeThickness = 1,
                    Stroke = new SolidColorBrush(Color.Parse("Black")),
                };

                this.snapGridCanvas.Children.Add(newLine);
            }
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void TestErrorHandler(bool critical)
    {
        GenericHelpers.HandleError(this, "This is a test error.", critical);
    }
}