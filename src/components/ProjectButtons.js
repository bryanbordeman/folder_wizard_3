import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ProjectButtons(props) {
    const { projectType, handleChangeProjectType, darkState} = props
    const [ value, setValue ] = React.useState('');
    const didMount = React.useRef(false);

    const projectTypes = [
        {id: 1, name: 'project'},
        {id: 2, name: 'service'},
        {id: 3, name: 'HSE project'}
    ];

    React.useEffect(() => {
        //! might not work need to come back to this
        //! update to use projectType var not hard input
        if (didMount.current) {
            setValue(1);
        } else {
            didMount.current = true;
        }
    },[]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if(projectTypes.find(x => x.id === newValue)){
            handleChangeProjectType(projectTypes.find(x => x.id === newValue).id);
        };
    };

    return (
        <ToggleButtonGroup
        sx={{width: '100%'}}
        color={darkState? "secondary" : "primary" }
        value={value}
        exclusive
        onChange={handleChange}
        >
            {projectTypes.map(project => (
                <ToggleButton 
                    key={project.id} 
                    sx={{width: '100%'}} 
                    value={project.id}>
                        {project.name}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}