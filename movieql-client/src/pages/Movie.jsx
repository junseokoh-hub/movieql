import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  background-image: linear-gradient(-45deg, #d754ab, #fd723a);
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
`;

const Column = styled.div`
  margin-left: 10px;
  width: 50%;
`;

const Title = styled.h1`
  font-size: 65px;
  margin-bottom: 15px;
`;

const Subtitle = styled.h4`
  font-size: 35px;
  margin-bottom: 10px;
`;

const Image = styled.div`
  width: 25%;
  height: 60%;
  background-color: transparent;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
  border-radius: 7px;
`;

const Button = styled.button`
  width: 4rem;
  height: 2rem;
  border: 1px solid #fff;
  border-radius: 0.25rem;
  font-weight: bold;
  color: #fff;
  background-color: ${(props) => props.bg};
  transition: all 0.1s ease-in-out;
  cursor: pointer;
`;

const MOVIE_DETAIL = gql`
  query getDetails($movieDetailId: ID!) {
    movieDetail(movieId: $movieDetailId) {
      id
      original_title
      poster_path
      backdrop_path
      vote_average
      isLiked @client
    }
  }
`;

const Movie = () => {
  const { id } = useParams();
  const {
    data,
    loading,
    client: { cache },
  } = useQuery(MOVIE_DETAIL, {
    variables: {
      movieDetailId: id,
    },
  });

  const onClick = () => {
    cache.writeFragment({
      id: `MovieDetail:${id}`,
      fragment: gql`
        fragment MovieDetailFragment on MovieDetail {
          isLiked
        }
      `,
      data: {
        isLiked: !data?.movieDetail?.isLiked,
      },
    });
  };

  return (
    <Container>
      <Column>
        <Title>
          {loading
            ? "Loading..."
            : `${data?.movieDetail?.original_title || data?.movieDetail.title}`}
        </Title>
        <Subtitle>
          ⭐️
          {loading ? "" : data?.movieDetail?.vote_average.toFixed(1) || "9.0"}
        </Subtitle>
        <Button
          bg={data?.movieDetail?.isLiked ? "rebeccapurple" : "transparent"}
          onClick={onClick}
        >
          {data?.movieDetail?.isLiked ? "Unlike" : "Like"}
        </Button>
      </Column>
      <Image
        bg={`${import.meta.env.VITE_IMAGE_URL}/original${
          data?.movieDetail?.poster_path || data?.movieDetail?.backdrop_path
        }`}
      />
    </Container>
  );
};

export default Movie;
