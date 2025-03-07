import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AvatarEditor from "react-avatar-editor";
import domtoimage from "dom-to-image";
import defaultAvatar from "./assets/default.jpeg";
import _ from "lodash";

const ExportAvatar = ({ avatar }: { avatar: string }) => {
  const handleExport = () => {
    const element = document.getElementById("exportable-avatar");
    if (element) {
      domtoimage
        .toPng(element)
        .then((dataUrl: string) => {
          const link = document.createElement("a");
          link.download = "头像.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error("Error exporting image:", error);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <a
        href="#"
        id="exportable-avatar"
        className="p-3 bg-gradient-to-br  from-60% from-red-500 to-indigo-500 rounded-full"
      >
        <img className="rounded-full h-40 w-40" src={avatar} alt="avatar" />
      </a>
      <button
        onClick={handleExport}
        className="mt-4 p-2 bg-blue-500 text-white"
      >
        导出
      </button>
    </div>
  );
};

function App() {
  const [avatar, setAvatar] = useState(defaultAvatar);

  const onch = useCallback((v: string) => setAvatar(v), []);

  return (
    <div className="flex items-center justify-center h-screen space-x-20">
      <AvatarUploader onChange={onch} />
      <ExportAvatar avatar={avatar} />
    </div>
  );
}

type State = {
  scale: number;
};

const AvatarUploader = memo(
  ({ onChange }: { onChange?: (v: string) => void }) => {
    const editor = useRef<AvatarEditor>(null);
    const [uploadAvatar, setuploadAvatar] = useState(defaultAvatar);

    const onPositionChange = _.debounce(() => {
      if (editor && editor.current) {
        const canvas = editor.current.getImage();
        onChange?.(canvas.toDataURL());
      }
    }, 300);
    const [state, setState] = useState<State>({
      scale: 1,
    });
    useEffect(() => {
      setState({ scale: 1 });
    }, [uploadAvatar]);
    useEffect(() => {
      if (state.scale) {
        onPositionChange();
      }
    }, [state.scale, onPositionChange]);

    const handleScale = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const scale = parseFloat(e.target.value);
        setState({ ...state, scale });
      },
      [state]
    );

    return (
      <div className="text-black flex flex-col space-y-2">
        <AvatarEditor
          onPositionChange={onPositionChange}
          image={uploadAvatar}
          ref={editor}
          width={250}
          borderRadius={1000}
          height={250}
          border={50}
          color={[255, 255, 255, 0.6]}
          scale={state.scale}
        />
        调整大小:{" "}
        <input
          name="scale"
          type="range"
          value={state.scale}
          onChange={handleScale}
          min={"1"}
          max="3"
          step="0.01"
        />
        <input
          className="block w-72 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          id="file_input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (reader) {
                  setuploadAvatar(reader.result as string);
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
    );
  }
);

export default App;
