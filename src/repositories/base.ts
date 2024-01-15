interface BaseRepository<T> {
    findById(id: number): Promise<T | null>;
    findByPublicId(publicId: string): Promise<T | null>;
}
export default BaseRepository;
