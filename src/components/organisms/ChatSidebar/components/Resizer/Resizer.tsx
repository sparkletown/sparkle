import React from "react";

import "./Resizer.scss";

interface Props {
  width: number;
  onChangeWidth: (width: number) => void;
}

interface States {
  begin: number;
  width: number;
}

export class Resizer extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      begin: 0,
      width: 0,
    };
  }

  onMouseDown = (e: React.MouseEvent) => {
    document.addEventListener("mouseup", this.onDocumentMouseUp);
    document.addEventListener("mousemove", this.onDocumentMouseMove);
    this.setState({ begin: e.clientX, width: this.props.width });
  };

  onDocumentMouseMove = (e: MouseEvent) => {
    this.props.onChangeWidth(this.state.width - e.clientX + this.state.begin);
  };

  onDocumentMouseUp = () => {
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
    document.removeEventListener("mousemove", this.onDocumentMouseMove);
  };

  render() {
    return <div className="resizer" onMouseDown={this.onMouseDown} />;
  }
}
