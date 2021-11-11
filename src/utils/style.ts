import styled from 'styled-components';

export const Button = styled.label`
  border-radius: 30px;
  padding: 10px 20px;
  color: ${props => props.theme.main};
  cursor: pointer;
  border: 2px solid ${props => props.theme.main};
  &:hover {
      transition: ease 0.8;
    color: ${props => props.theme.hover};
    border: 2px solid ${props => props.theme.hover};

  }
`

export const Title = styled.h2`
    color: "mediumseagreen";
    font-size: 2rem;
    font-weight: 800;
`

Button.defaultProps = {
    theme: {
        main: "mediumseagreen",
        hover: "#666"
    }
}

export const Theme = {
    main: 'white',
    hover: "#666"
}