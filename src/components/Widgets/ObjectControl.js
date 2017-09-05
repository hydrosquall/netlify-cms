import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ControlHOC from './ControlHOC';
import { resolveWidget } from '../Widgets';
import controlStyles from '../ControlPanel/ControlPane.css';
import styles from './ObjectControl.css';

export default class ObjectControl extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onOpenMediaLibrary: PropTypes.func.isRequired,
    mediaPaths: ImmutablePropTypes.map.isRequired,
    onAddAsset: PropTypes.func.isRequired,
    onRemoveAsset: PropTypes.func.isRequired,
    getAsset: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.object,
      PropTypes.bool,
    ]),
    field: PropTypes.object,
    forID: PropTypes.string,
    className: PropTypes.string,
  };

  /**
   * Always update so that each nested widget has the option to update. This is
   * required because ControlHOC provides a default `shouldComponentUpdate`
   * which only updates if the value changes, but every widget must be allowed
   * to override this.
   */
  shouldComponentUpdate() {
    return true;
  }

  onChange = (fieldName, newValue, newMetadata) => {
    const { value, onChange } = this.props;
    const objectValue = value || Map();
    const newObjectValue = objectValue.set(fieldName, newValue);
    return this.props.onChange(newObjectValue, newMetadata);
  };

  controlFor(field) {
    const { onAddAsset, onOpenMediaLibrary, mediaPaths, onRemoveAsset, getAsset, value, onChange } = this.props;
    if (field.get('widget') === 'hidden') {
      return null;
    }
    const widget = resolveWidget(field.get('widget') || 'string');
    const fieldValue = value && Map.isMap(value) ? value.get(field.get('name')) : value;

    return (<div className={controlStyles.widget} key={field.get('name')}>
      <div className={controlStyles.control} key={field.get('name')}>
        <label className={controlStyles.label} htmlFor={field.get('name')}>{field.get('label')}</label>
        <ControlHOC
          controlComponent={widget.control}
          field={field}
          value={fieldValue}
          onChange={this.onChange.bind(this, field.get('name'))}
          mediaPaths={mediaPaths}
          onOpenMediaLibrary={onOpenMediaLibrary}
          onAddAsset={onAddAsset}
          onRemoveAsset={onRemoveAsset}
          getAsset={getAsset}
          forID={field.get('name')}
        />
      </div>
    </div>);
  }

  render() {
    const { field, forID } = this.props;
    const multiFields = field.get('fields');
    const singleField = field.get('field');
    const className = this.props.className || '';

    if (multiFields) {
      return (<div id={forID} className={`${ className } ${ styles.root }`}>
        {multiFields.map(f => this.controlFor(f))}
      </div>);
    } else if (singleField) {
      return this.controlFor(singleField);
    }

    return <h3>No field(s) defined for this widget</h3>;
  }
}
