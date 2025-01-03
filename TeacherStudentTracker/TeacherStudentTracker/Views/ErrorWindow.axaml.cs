using Avalonia.ReactiveUI;
using ReactiveUI;
using System;
using System.Threading.Tasks;
using System.Windows.Input;
using TeacherStudentTracker.ViewModels;

namespace TeacherStudentTracker.Views;

public partial class ErrorWindow : ReactiveWindow<NewErrorViewModel>
{
    public bool Critical { get; set; }

    public ErrorWindow()
    {
        this.InitializeComponent();

        ICommand createBackupCommand = ReactiveCommand.CreateFromTask(() =>
        {
            this.CreateBackup();

            return Task.CompletedTask;
        });

        ICommand CloseWindowCommand = ReactiveCommand.CreateFromTask(() =>
        {
            this.CloseWindow();

            return Task.CompletedTask;
        });

        var newStudentViewModel = new NewErrorViewModel(createBackupCommand, CloseWindowCommand);
        this.DataContext = newStudentViewModel;
    }

    public void CreateBackup()
    {
        if (MainWindow.SelectedSchoolClass is null)
        {
            return;
        }

        string tempName = MainWindow.SelectedSchoolClass.Name;

        MainWindow.SelectedSchoolClass.Name += "_backup";

        GenericHelpers.SaveClass(MainWindow.SelectedSchoolClass);

        MainWindow.SelectedSchoolClass.Name = tempName;
    }

    public void SetErrorMessage(string message, bool critical)
    {
        this.errorBox.Text = message;
        this.Critical = critical;

        this.errorDescription.Text = Constants.ErrorDescription1;

        if (critical)
        {
            this.errorDescription.Text = Constants.ErrorDescription2;
        }
    }

    public void CloseWindow()
    {
        if (!this.Critical)
        {
            this.Close();

            return;
        }

        Environment.Exit(0);
    }
}
