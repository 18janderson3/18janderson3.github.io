using BasicDataTemplateSample.ViewModels;
using System.Windows.Input;

namespace TeacherStudentTracker.ViewModels
{
    public class NewErrorViewModel : ViewModelBase
    {
        public ICommand CloseWindowCommand { get; }

        public ICommand CreateBackupCommand { get; }

        public NewErrorViewModel(ICommand createBackupCommand, ICommand closeWindowCommand)
        {
            this.CreateBackupCommand = createBackupCommand;
            this.CloseWindowCommand = closeWindowCommand;
        }
    }
}
