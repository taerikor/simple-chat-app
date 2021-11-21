import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContentWrapper = styled.div<{ isOwner: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isOwner ? "row-reverse" : "row")};
  margin-bottom: 20px;
  margin-top: 6px;
`;
export const ChatBox = styled.div<{ isOwner: boolean }>`
  background-color: ${(props) =>
    props.isOwner ? "mediumseagreen" : "#686a68"};
  max-width: 80%;
  padding: 10px 10px;
  margin: 5px 0;
  border-radius: 10px;
`;

export const Delete = styled.span`
  padding: 0;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid #ffffff;
  }
`;
export const SideWrapper = styled.div`
  margin: 8px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Date = styled.span`
  color: #666;
  font-size: 12px;
  margin-bottom: 3px;
`;

export const DirectionWrapper = styled.div<{ isOwner: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isOwner ? "row-reverse" : "row")};
`;

export const Image = styled.img`
  max-height: 400px;
  max-width: 400px;
`;

export const Text = styled.p`
  margin: 0;
  padding: 0;
`;
