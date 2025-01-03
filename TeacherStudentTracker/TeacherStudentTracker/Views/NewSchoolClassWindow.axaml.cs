using Avalonia.Controls;
using Avalonia.ReactiveUI;
using ReactiveUI;
using System;
using System.Threading.Tasks;
using System.Windows.Input;
using TeacherStudentTracker.Data;
using TeacherStudentTracker.ViewModels;

namespace TeacherStudentTracker.Views;

public partial class NewSchoolClassWindow : ReactiveWindow<NewSchoolClassViewModel>
{
    public SchoolClass SelectedClass { get; set; }

    public NewSchoolClassWindow() : this(new SchoolClass("noname")) {}
    
    public NewSchoolClassWindow(SchoolClass newClass)
    {
        try
        {
            this.InitializeComponent();

            ICommand addCustomFieldCommand = ReactiveCommand.CreateFromTask(() =>
            {
                this.AddCustomField();

                return Task.CompletedTask;
            });

            ICommand saveSchoolClassCommand = ReactiveCommand.CreateFromTask(() =>
            {
                this.Save();

                return Task.CompletedTask;
            });

            var newSchoolClassViewModel = new NewSchoolClassViewModel(addCustomFieldCommand, saveSchoolClassCommand);
            DataContext = newSchoolClassViewModel;
            SelectedClass = newClass;
            nameBox.Text = SelectedClass.Name;
            string[] newFields = SelectedClass.CustomFields.ToArray();
            fieldListBox.ItemsSource = newFields;
        }
        catch (Exception ex)
        {
            SelectedClass = null!;
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void AddCustomField()
    {
        try
        {
            if (this.fieldBox.Text is null)
            {
                return;
            }

            this.SelectedClass.CustomFields.Add(this.fieldBox.Text);
            string[] newFields = this.SelectedClass.CustomFields.ToArray();
            this.fieldListBox.ItemsSource = newFields;
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }

    public void Save()
    {
        try
        {
            if (this.nameBox.Text is not null)
            {
                this.SelectedClass.Name = this.nameBox.Text;
            }

            SelectedClass.Save = true;
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }

        this.Close();
    }

    public void DeleteField(object sender, SelectionChangedEventArgs args)
    {
        try
        {
            if (this.fieldListBox.SelectedItem is null)
            {
                return;
            }

            this.SelectedClass.CustomFields.Remove((string)this.fieldListBox.SelectedItem);
            string[] newFields = this.SelectedClass.CustomFields.ToArray();
            this.fieldListBox.ItemsSource = newFields;
        }
        catch (Exception ex)
        {
            GenericHelpers.HandleError(this, ex.Message + "\n" + ex.StackTrace);
        }
    }
}