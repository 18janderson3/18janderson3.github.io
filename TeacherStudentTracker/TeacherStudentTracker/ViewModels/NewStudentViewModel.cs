using Avalonia.Media.Imaging;
using BasicDataTemplateSample.ViewModels;
using System.Windows.Input;
namespace TeacherStudentTracker.ViewModels
{
    public class NewStudentViewModel : ViewModelBase
    {
        public ICommand AddImageCommand { get; }

        public ICommand SaveStudentCommand { get; }

        public Bitmap DefaultStudentImage => Constants.DefaultStudentImageBitmap;

        public NewStudentViewModel(ICommand addImageCommand, ICommand saveStudentCommand)
        {
            this.AddImageCommand = addImageCommand;
            this.SaveStudentCommand = saveStudentCommand;
        }
    }
}
