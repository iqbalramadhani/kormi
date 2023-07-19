import React from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
import "./styles.css";

class Editor extends React.Component {
  state = {
    value: "",
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value === "" && nextProps.defaultValue) {
      this.setState({ value: nextProps.defaultValue });
    }
  }

  handleChange = (value) => {
    this.setState({ value });
    if (this.props.onChange) {
      const obj = {
        target: {
          name: this.props.name,
          value,
        },
      };
      this.props.onChange(obj);
    }
  };

  render() {
    return (
      <div className="text-editor">
        <EditorToolbar />
        <ReactQuill
          style={this.props.style ? this.props.style : {height:"500px"}}
          theme="snow"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder={
            this.props.placeholder ? this.props.placeholder : "Masukkan deskripsi"
          }
          modules={modules}
          formats={formats}
        />
      </div>
    );
  }
}

export default Editor;
