from database import jobs
from rq import Worker, Queue, Connection


if __name__ == '__main__':
    with Connection(jobs.conn):
        worker = Worker(map(Queue, jobs.listen))
        worker.work(with_scheduler=True)