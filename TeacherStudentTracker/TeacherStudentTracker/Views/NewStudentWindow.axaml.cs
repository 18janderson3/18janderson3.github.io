using Avalonia;
using Avalonia.Controls;
using Avalonia.Media.Imaging;
using Avalonia.Platform.Storage;
using Avalonia.ReactiveUI;
using ReactiveUI;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using TeacherStudentTracker.Data;
using TeacherStudentTracker.ViewModels;

namespace TeacherStudentTracker.Views;

public partial class NewStudentWindow : ReactiveWindow<NewStudentViewModel>
{
    public Bitmap Picture { get; set; } = null!;

    private Student? SelectedStudent { get; set; } = null;

    public NewStudentWindow()
    {
        try
        {
            if (MainWindow.SelectedSchoolClass is null)
            {
                this.Close();

                return;
            }

            this.InitializeComponent();

            ICommand addImageCommand = ReactiveCommand.CreateFromTask(() =>
            {
                this.AddImage();

                return Task.CompletedTask;
            });

            ICommand saveStudentCommand = ReactiveCommand.CreateFromTask(() =>
            {
                this.SaveStudent();

                return Task.CompletedTask;
            });

            var newStudentViewModel = new NewStudentViewModel(addImageCommand, saveStudentCommand);
            this.DataContext = newStudentViewModel;

            this.Picture = newStudentViewModel.DefaultStudentImage;
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message, true);
        }
    }

    public async void AddImage()
    {
        try
        {
            if (this.SelectedStudent is null)
            {
                return;
            }

            // Get top level from the current control. Alternatively, you can use Window reference instead.
            TopLevel topLevel = TopLevel.GetTopLevel(this)!;

            // Start async operation to open the dialog.
            IReadOnlyList<IStorageFile> files = await topLevel.StorageProvider.OpenFilePickerAsync(new FilePickerOpenOptions
            {
                Title = "Select Image File",
                AllowMultiple = false,
                FileTypeFilter = [FilePickerFileTypes.ImageAll]
            });

            if (files.Count < 1)
            {
                return;
            }

            using (Stream coverStream = await files[0].OpenReadAsync())
            {
                Bitmap temp = new(coverStream);

                this.Picture = temp;
                this.studentProfileImage.Source = this.Picture;
            }
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void SaveStudent()
    {
        try
        {
            if (this.SelectedStudent is null)
            {
                return;
            }

            this.SelectedStudent.FirstNames = this.firstNameBox.Text is not null ? this.firstNameBox.Text : "Missing First Name";
            this.SelectedStudent.LastName = this.lastNameBox.Text is not null ? this.lastNameBox.Text : "Missing Last Name";
            this.SelectedStudent.Picture = this.Picture;

            List<CustomField> cList = [];
            for(int i = 0; i < this.SelectedStudent.ExtraFields.Count; i++)
            {
                foreach(DockPanel d in this.fieldPanel.Children.Cast<DockPanel>())
                {
                    string name = "";
                    string data = "";
                    foreach(var s in d.Children)
                    {
                        if (s is TextBlock block)
                        {
                            name = block.Text!.Remove(block.Text!.Length - 2);
                        }

                        if (s is TextBox box)
                        {
                            data = box.Text!;
                        }
                    }

                    if (this.SelectedStudent.ExtraFields[i].Name == name)
                    {
                        this.SelectedStudent.ExtraFields[i].Data = data;
                    }
                }
            }

            GenderEnum gender;
            if (this.genderRadioButton1.IsChecked == true)
            {
                gender = GenderEnum.Unknown;
            }
            else if (this.genderRadioButton2.IsChecked == true)
            {
                gender = GenderEnum.Male;
            }
            else if (this.genderRadioButton3.IsChecked == true)
            {
                gender = GenderEnum.Female;
            }
            else
            {
                throw new Exception("Missing Gender Exception");
            }

            this.SelectedStudent.Gender = gender;

            SelectedStudent.Save = true;
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }

        Close();
    }

    public void SetSelectedStudent(Student student)
    {
        try
        {
            this.SelectedStudent = student;

            this.firstNameBox.Text = student.FirstNames;
            this.lastNameBox.Text = student.LastName;

            this.Picture = student.Picture is not null ? student.Picture : Constants.DefaultStudentImageBitmap;

            foreach(CustomField f in this.SelectedStudent.ExtraFields){
                DockPanel dock = new();

                TextBlock textBlock = new();
                textBlock.Margin = new Thickness(0, 5);
                textBlock.VerticalAlignment = Avalonia.Layout.VerticalAlignment.Center;
                textBlock.Text = f.Name + ": ";

                TextBox textBox = new();
                textBox.Margin = new Thickness(0, 5);
                textBlock.VerticalAlignment = Avalonia.Layout.VerticalAlignment.Center;
                if (f.Data is not null) textBox.Text = (string)f.Data;

                dock.Children.Add(textBlock);
                dock.Children.Add(textBox);
                this.fieldPanel.Children.Add(dock);
            }

            switch (student.Gender)
            {
                case GenderEnum.Unknown:
                    this.genderRadioButton1.IsChecked = true;
                    this.genderRadioButton2.IsChecked = false;
                    this.genderRadioButton3.IsChecked = false;

                    break;

                case GenderEnum.Male:
                    this.genderRadioButton1.IsChecked = false;
                    this.genderRadioButton2.IsChecked = true;
                    this.genderRadioButton3.IsChecked = false;

                    break;

                case GenderEnum.Female:

                    this.genderRadioButton1.IsChecked = false;
                    this.genderRadioButton2.IsChecked = false;
                    this.genderRadioButton3.IsChecked = true;

                    break;
            }
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }
}
